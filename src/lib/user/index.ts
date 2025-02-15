import defaults from '../../config/defaults';
import Profile from '../../model/Profile';
import Progress from '../../model/Progress';
import User from '../../model/User';
import WorkoutPlan from '../../model/WorkoutPlan';
import { Role, UStatus } from '../../types/enums';
import { CreateAccountParam, IUser, UserUpdateProps } from '../../types/interfaces';
import { badRequest, notFound } from '../../utils/error';
import { generateHash } from '../../utils/hashing';

class UserService {
  /**
   * Finds a user by email.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<IUser | false>} - The user if found, otherwise false.
   */
  public async findUserByEmail(email: string): Promise<IUser | false> {
    const user = await User.findOne({ email });
    return user ? user : false;
  }

  /**
   * Checks if a user exists with the given email.
   * @param {string} email - The email to check.
   * @returns {Promise<boolean>} - True if the user exists, otherwise false.
   */
  public async userExist(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return !!user;
  }

  /**
   * Creates a new user account.
   * @param {CreateAccountParam} params - Parameters including name, email, and password.
   * @returns {Promise<IUser>} - The newly created user.
   * @throws {Error} - Throws an error if required parameters are missing.
   */
  public async createAccount({ name, email, password }: CreateAccountParam): Promise<IUser> {
    if (!name || !email || !password) {
      throw badRequest('Invalid parameters!');
    }

    const user = new User({ name, email, password });
    await user.save();

    return {
      ...user.toObject(),
      id: user.id,
    };
  }

  /**
   * Finds all users with optional filtering, sorting, and pagination.
   * @param {Object} params - Query parameters including page, limit, sortType, sortBy, name, and email.
   * @returns {Promise<IUser[]>} - A list of filtered and paginated users.
   */
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    name = '',
    email = '',
  }: {
    page?: number;
    limit?: number;
    sortType?: string;
    sortBy?: string;
    name?: string;
    email?: string;
  }): Promise<IUser[]> {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
    const filter = {
      $and: [
        { name: { $regex: name, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    const users = await User.find(filter)
      .sort(sortStr)
      .skip(page * limit - limit)
      .limit(limit);

    return users.map((user) => ({
      ...user.toObject(),
      id: user.id,
    }));
  }

  /**
   * Counts the number of users matching the provided filters.
   * @param {Object} filters - Filters including name and email.
   * @returns {Promise<number>} - The count of matching users.
   */
  public async count({
    name = '',
    email = '',
  }: {
    name?: string;
    email?: string;
  }): Promise<number> {
    const filter = {
      $and: [
        { name: { $regex: name, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    return User.countDocuments(filter);
  }

  /**
   * Creates a new user.
   * @param {IUser} params - User details including name, email, password, role, and status.
   * @returns {Promise<IUser>} - The newly created user.
   * @throws {Error} - Throws an error if required parameters are missing.
   */
  public async create({
    name,
    email,
    password,
    role = Role.USER,
    status = UStatus.PENDING,
  }: IUser): Promise<IUser> {
    if (!name || !email || !password) {
      throw badRequest('Invalid parameters!');
    }

    const hashedPassword = await generateHash(password);
    const user = new User({ name, email, password: hashedPassword, role, status });
    await user.save();

    return {
      ...user.toObject(),
      id: user.id,
    };
  }

  /**
   * Finds a single user by ID.
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<IUser>} - The found user.
   * @throws {Error} - Throws an error if the ID is not provided or if the user is not found.
   */
  public async findSingleItem(id: string): Promise<IUser> {
    if (!id) {
      throw badRequest('ID is required!');
    }

    const user: any = await User.findById(id);

    if (!user) {
      throw notFound();
    }

    return {
      ...user.toObject(),
      id: user.id,
    };
  }

  /**
   * Updates user properties using a PATCH request.
   * @param {string} id - The ID of the user to update.
   * @param {UserUpdateProps} updates - The properties to update.
   * @returns {Promise<IUser>} - The updated user.
   * @throws {Error} - Throws an error if the user is not found.
   */
  public async updateProperties(id: string, updates: UserUpdateProps): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw notFound();
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();
    return {
      ...user.toObject(),
      id: user.id,
    };
  }

  /**
   * Deletes a user by ID and asynchronously deletes all associated data.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<IUser | null>} - The deleted user.
   * @throws {Error} - Throws an error if the user is not found.
   */
  public async removeItem(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) {
      throw notFound();
    }

    // Delete associated workout plans
    const workoutPlanIds = await WorkoutPlan.find({ builder: id }).distinct('_id');
    if (workoutPlanIds.length > 0) {
      await WorkoutPlan.deleteMany({ _id: { $in: workoutPlanIds } });
    }

    // Delete associated progress entries
    const progressIds = await Progress.find({ builder: id }).distinct('_id');
    if (progressIds.length > 0) {
      await Progress.deleteMany({ _id: { $in: progressIds } });
    }

    // Delete associated profile
    const profileId = await Profile.findOne({ user: id }).distinct('_id');
    if (profileId.length > 0) {
      await Profile.deleteOne({ _id: { $in: profileId } });
    }

    return User.findByIdAndDelete(id);
  }

  /**
   * Changes the password of a user.
   * @param {string} id - The ID of the user.
   * @param {string} password - The new password.
   * @returns {Promise<IUser>} - The updated user.
   * @throws {Error} - Throws an error if the password is not provided or if the user is not found.
   */
  public async changePassword(id: string, password: string): Promise<IUser> {
    if (!password) {
      throw badRequest('Password is required!');
    }

    const user: any = await User.findById(id);

    if (!user) {
      throw notFound();
    }

    const hashedPassword = await generateHash(password);
    user.password = hashedPassword;

    await user.save();
    return {
      ...user.toObject(),
      id: user.id,
    };
  }
}

// Create an instance of UserService
const userService = new UserService();

export default userService;
