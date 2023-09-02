import userService from '../user';
import {badRequest} from '../../utils/CustomError';
import { generateHash, hashMatched } from '../../utils/hashing';
import tokenService from '../../lib/token';

interface LoginParam {
  email: string;
  password: string;
}

interface RegisterParam extends LoginParam {
  name: string;
}

class AuthService {
  public async register({ name, email, password }: RegisterParam) {
    const hasUser = await userService.userExist(email);

    if (hasUser) throw badRequest('User Already Exist');

    password = await generateHash(password);
    const user = await userService.createAccount({ name, email, password });

    return user;

    // TODO: send verification email
  }

  public async login({ email, password }: LoginParam) {
    const user: any = await userService.findUserByEmail(email);
    if (!user) throw badRequest('Invalid Credentials!');

    const matched = await hashMatched(password, user.password);
    if (!matched) throw badRequest('Invalid Credentials!');

    // generate access token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return tokenService.generateToken({payload})
  }
}

const authService = new AuthService();

export default authService;
