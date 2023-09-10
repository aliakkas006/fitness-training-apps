import defaults from '../../config/defaults';
import Profile, { FitnessLevel, Goal, IProfile } from '../../model/Profile';
import { badRequest, notFound } from '../../utils/CustomError';

interface UpdatePropertiesParam {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  age: number;
  height: number;
  weight: number;
  fitnessLevel: FitnessLevel;
  goal: Goal;
}

class ProfileService {
  private async findProfileByEmail(email: string): Promise<boolean> {
    const profile = await Profile.findOne({ email });
    return profile ? true : false;
  }

  // Find all profiles
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    firstName = '',
    lastName = '',
    email = '',
  }) {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
    const filter = {
      $and: [
        { firstName: { $regex: firstName, $options: 'i' } },
        { lastName: { $regex: lastName, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };

    const profiles: any = await Profile.find(filter)
      .populate({ path: 'user', select: 'name' })
      .sort(sortStr)
      .skip((page - 1) * limit)
      .limit(limit);

    return profiles.map((profile: any) => ({
      ...profile._doc,
      id: profile.id,
    }));
  }

  // Count profiles based on provided filters
  public async count({ firstName = '', lastName = '' }): Promise<number> {
    const filter = {
      firstName: { $regex: firstName, $options: 'i' },
      lastName: { $regex: lastName, $options: 'i' },
    };

    return Profile.count(filter);
  }

  // Create a new Profile
  public async create({
    firstName,
    lastName,
    email,
    profilePic = '',
    age,
    height,
    weight,
    fitnessLevel,
    goal,
    user,
  }: any): Promise<any> {
    const hasProfile = await this.findProfileByEmail(email);
    if (hasProfile) throw badRequest('Profile already exist!');

    if (!firstName || !lastName || !age || !height || !weight || !fitnessLevel || !goal || !user)
      throw badRequest('Invalid parameters!');

    const profile: any = new Profile({
      firstName,
      lastName,
      email,
      profilePic,
      age,
      height,
      weight,
      fitnessLevel,
      goal,
      user: user.id,
    });

    await profile.save();

    return { ...profile._doc, id: profile.id };
  }

  // Find a single profile by id
  public async findSingleItem(id: string) {
    if (!id) throw badRequest('Id is required!');

    const profile: any = await Profile.findById(id);
    if (!profile) throw notFound();

    return {
      ...profile._doc,
      id: profile.id,
    };
  }

  // Update the profile properties using PATCH request
  public async updateProperties(
    id: string,
    {
      firstName,
      lastName,
      email,
      profilePic,
      age,
      height,
      weight,
      fitnessLevel,
      goal,
    }: UpdatePropertiesParam
  ): Promise<any> {
    const profile: any = await Profile.findById(id);
    if (!profile) throw notFound();

    const payload: any = {
      firstName,
      lastName,
      email,
      profilePic,
      age,
      height,
      weight,
      fitnessLevel,
      goal,
    };

    Object.keys(payload).forEach((key) => {
      profile[key] = payload[key] ?? profile[key];
    });

    await profile.save();
    return {
      ...profile._doc,
      id: profile.id,
    };
  }

  // Remove the profile by id
  // TODO: Asynchronously delete all data associated with the profle
  public async removeItem(id: string): Promise<IProfile | null> {
    const profile = await Profile.findById(id);
    if (!profile) throw notFound();

    return Profile.findByIdAndDelete(id);
  }
}

const profileService = new ProfileService();

export default profileService;
