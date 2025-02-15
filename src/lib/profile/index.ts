import defaults from '../../config/defaults';
import Profile from '../../model/Profile';
import User from '../../model/User';
import { CheckOwnershipParam, IProfile, ProfileUpdateProps } from '../../types/interfaces';
import { badRequest, notFound } from '../../utils/error';

class ProfileService {
  /**
   * Checks if a profile exists for the given email.
   * @param {string} email - The email to check.
   * @returns {Promise<boolean>} - True if the profile exists, otherwise false.
   */
  private async findProfileByEmail(email: string): Promise<boolean> {
    const profile = await Profile.findOne({ email });
    return !!profile;
  }

  /**
   * Finds all profiles with optional filtering, sorting, and pagination.
   * @param {Object} params - Query parameters including page, limit, sortType, sortBy, firstName, lastName, and email.
   * @returns {Promise<IProfile[]>} - A list of filtered and paginated profiles.
   */
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    firstName = '',
    lastName = '',
    email = '',
  }: {
    page?: number;
    limit?: number;
    sortType?: string;
    sortBy?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<IProfile[]> {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;

    const filter = {
      $and: [
        { firstName: { $regex: firstName, $options: 'i' } },
        { lastName: { $regex: lastName, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    const profiles = await Profile.find(filter)
      .populate({ path: 'user', select: 'name' })
      .sort(sortStr)
      .skip((page - 1) * limit)
      .limit(limit);

    return profiles.map((profile) => ({
      ...profile.toObject(),
      id: profile.id,
    }));
  }

  /**
   * Counts the number of profiles matching the provided filters.
   * @param {Object} filters - Filters including firstName, lastName, and email.
   * @returns {Promise<number>} - The count of matching profiles.
   */
  public async count({
    firstName = '',
    lastName = '',
    email = '',
  }: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<number> {
    const filter = {
      $and: [
        { firstName: { $regex: firstName, $options: 'i' } },
        { lastName: { $regex: lastName, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    return Profile.countDocuments(filter);
  }

  /**
   * Creates a new profile.
   * @param {Object} params - Profile details including firstName, lastName, email, avatar, age, height, weight, fitnessLevel, goal, and user.
   * @returns {Promise<IProfile>} - The newly created profile.
   * @throws {Error} - Throws an error if the profile already exists or if required parameters are missing.
   */
  public async create({
    firstName,
    lastName,
    email,
    avatar = '',
    age,
    height,
    weight,
    fitnessLevel,
    goal,
    user,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    age: number;
    height: number;
    weight: number;
    fitnessLevel: string;
    goal: string;
    user: { id: string };
  }): Promise<IProfile> {
    const hasProfile = await this.findProfileByEmail(email);
    if (hasProfile) {
      throw badRequest('Profile already exists!');
    }

    if (!firstName || !lastName || !age || !height || !weight || !fitnessLevel || !goal || !user) {
      throw badRequest('Invalid parameters!');
    }

    const profile: any = new Profile({
      firstName,
      lastName,
      email,
      avatar,
      age,
      height,
      weight,
      fitnessLevel,
      goal,
      user: user.id,
    });

    await profile.save();

    return {
      ...profile.toObject(),
      id: profile.id,
    };
  }

  /**
   * Finds a single profile by ID.
   * @param {string} id - The ID of the profile to find.
   * @returns {Promise<IProfile>} - The found profile.
   * @throws {Error} - Throws an error if the ID is not provided or if the profile is not found.
   */
  public async findSingleItem(id: string): Promise<IProfile> {
    if (!id) {
      throw badRequest('ID is required!');
    }

    const profile: any = await Profile.findById(id);
    if (!profile) {
      throw notFound();
    }

    return {
      ...profile.toObject(),
      id: profile.id,
    };
  }

  /**
   * Updates profile properties using a PATCH request.
   * @param {string} id - The ID of the profile to update.
   * @param {ProfileUpdateProps} updates - The properties to update.
   * @returns {Promise<IProfile>} - The updated profile.
   * @throws {Error} - Throws an error if the profile is not found.
   */
  public async updateProperties(id: string, updates: ProfileUpdateProps): Promise<IProfile> {
    const profile: any = await Profile.findById(id);

    if (!profile) {
      throw notFound();
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        profile[key] = updates[key];
      }
    });

    await profile.save();
    return {
      ...profile.toObject(),
      id: profile.id,
    };
  }

  /**
   * Removes a profile by ID and deletes the associated user.
   * @param {string} id - The ID of the profile to remove.
   * @returns {Promise<IProfile | null>} - The deleted profile.
   * @throws {Error} - Throws an error if the profile is not found.
   */
  public async removeItem(id: string): Promise<IProfile | null> {
    const profile = await Profile.findById(id);
    if (!profile) {
      throw notFound();
    }

    const user = await User.findOne({ _id: profile.user });
    if (user) {
      await User.findByIdAndDelete(user._id); // Delete the associated user
    }

    return Profile.findByIdAndDelete(id);
  }

  /**
   * Checks if the user owns the profile.
   * @param {CheckOwnershipParam} params - Parameters including resourceId and userId.
   * @returns {Promise<boolean>} - True if the user owns the profile, otherwise false.
   * @throws {Error} - Throws an error if the profile is not found.
   */
  public async checkOwnership({ resourceId, userId }: CheckOwnershipParam): Promise<boolean> {
    const profile = await Profile.findById(resourceId);
    if (!profile) {
      throw notFound();
    }

    return profile.user._id.toString() === userId;
  }
}

// Create an instance of ProfileService
const profileService = new ProfileService();

export default profileService;
