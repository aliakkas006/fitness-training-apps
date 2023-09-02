import User from '../../model/User';
import { IUser } from '../../model/User';
import {badRequest} from '../../utils/CustomError';

// TODO: create same interface for all model and service (do it in a interface file)

class UserService {
  public async findUserByEmail(email: string): Promise<IUser | false> {
    const user = await User.findOne({ email });
    return user ? user : false;
  }

  public async userExist(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return user ? true : false;
  }

  public async createAccount({ name, email, password }: IUser) {
    if (!name || !email || !password) throw badRequest('Invalid Arguments!');

    const user: any = new User({ name, email, password });
    await user.save();

    return { ...user._doc, id: user.id };
  }
}

const userService = new UserService();

export default userService;
