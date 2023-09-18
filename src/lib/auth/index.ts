import userService from '../user';
import { badRequest } from '../../utils/error';
import { generateHash, hashMatched } from '../../utils/hashing';
import tokenService from '../../lib/token';
import { LoginParam, LogoutParam, RegisterParam } from '../../types/interfaces';

class AuthService {
  public async register({ name, email, password }: RegisterParam) {
    const hasUser = await userService.userExist(email);
    if (hasUser) throw badRequest('User Already Exist');

    password = await generateHash(password);
    const user = await userService.createAccount({ name, email, password });

    return user;
  }

  public async login({ email, password, issuedIp }: LoginParam) {
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
    const accessToken = tokenService.generateAccessToken({ payload });

    // generate refresh token
    const refreshToken = await tokenService.generateRefreshToken({
      userId: user.id,
      issuedIp,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { accessToken, refreshToken };
  }

  public async logout({ token, clientIp, user }: LogoutParam) {
    // revoke (invalidate) the refresh token
    await tokenService.revokeRefreshToken({ token, clientIp });

    // blocked the user
    if (user.status === 'approved') user.status = 'blocked';
  }
}

const authService = new AuthService();

export default authService;
