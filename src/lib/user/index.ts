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
  public async findUserByEmail(email: string): Promise<IUser | false> {
    const user = await User.findOne({ email });
    return user ? user : false;
  }

  public async userExist(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return user ? true : false;
  }

  public async createAccount({ name, email, password }: CreateAccountParam) {
    if (!name || !email || !password) throw badRequest('Invalid Parameters!');

    const user: any = new User({ name, email, password });
    await user.save();

    return { ...user._doc, id: user.id };
  }

  // Find all users
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    name = '',
    email = '',
  }) {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
    const filter = {
      $and: [
        { name: { $regex: name, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    const users: any = await User.find(filter)
      .sort(sortStr)
      .skip(page * limit - limit)
      .limit(limit);

    return users.map((user: any) => ({
      ...user._doc,
      id: user.id,
    }));
  }

  // count users based on provided filters
  public async count({ name = '', email = '' }): Promise<number> {
    const filter = {
      $and: [
        { name: { $regex: name, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    return User.count(filter);
  }

  // create a new user
  public async create({
    name,
    email,
    password,
    role = Role.USER,
    status = UStatus.PENDING,
  }: IUser) {
    if (!name || !email || !password) throw badRequest('Invalid parameters!');

    password = await generateHash(password);
    const user: any = new User({ name, email, password, role, status });
    await user.save();

    return { ...user._doc, id: user.id };
  }

  // find a single user by id
  public async findSingleItem(id: string) {
    if (!id) throw badRequest('Id is required!');

    const user: any = await User.findById(id);
    if (!user) throw notFound();

    return {
      ...user._doc,
      id: user.id,
    };
  }

  // Update the User properties using PATCH request
  public async updateProperties(
    id: string,
    { name, email, role, status }: UserUpdateProps
  ): Promise<any> {
    const user: any = await User.findById(id);
    if (!user) throw notFound();

    const payload: any = { name, email, role, status };

    Object.keys(payload).forEach((key) => {
      user[key] = payload[key] ?? user[key];
    });

    await user.save();
    return {
      ...user._doc,
      id: user.id,
    };
  }

  // Delete the user by id and asynchronously delete all associated data
  public async removeItem(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) throw notFound();

    const workoutPlanIds = await WorkoutPlan.find({ builder: id }).distinct('_id');
    if (workoutPlanIds.length > 0) await WorkoutPlan.deleteMany({ _id: { $in: workoutPlanIds } });

    const progressIds = await Progress.find({ builder: id }).distinct('_id');
    if (progressIds.length > 0) await Progress.deleteMany({ _id: { $in: progressIds } });

    const profileId = await Profile.findOne({ user: id }).distinct('_id');
    await Profile.deleteOne({ _id: { $in: profileId } });

    // await profileService.removeItem(id);
    return User.findByIdAndDelete(id);
  }

  // Change the password of the user
  public async changePassword(id: string, password: string) {
    if (!password) throw badRequest('Password is required!');

    const user: any = await User.findById(id);
    if (!user) throw notFound();

    password = await generateHash(password);
    user.password = password ?? user.password;

    await user.save();
    return {
      ...user._doc,
      id: user.id,
    };
  }
}

const userService = new UserService();

export default userService;
