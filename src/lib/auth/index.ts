import userService from '../user';
import { badRequest } from '../../utils/error';
import { generateHash, hashMatched } from '../../utils/hashing';
import tokenService from '../../lib/token';
// import tokenService from '@lib/token';

import { LoginParam, RegisterParam, RotateRefreshTokenParam } from '../../types/interfaces';
import User from '../../model/User';

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
    const refreshToken: any = await tokenService.generateRefreshToken({
      userId: user.id,
      issuedIp,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // For the second time login after the user logged out - update the user status (approved)
    if (user.status === 'blocked') {
      user.status = 'approved';
      await user.save();
    }

    return { accessToken, refreshToken };
  }

  public async logout({ token, clientIp }: RotateRefreshTokenParam) {
    // revoke (invalidate) the refresh token
    const rToken = await tokenService.revokeRefreshToken({ token, clientIp });

    // Find the user and blocked the user status
    const user: any = await User.findById(rToken.user);
    if (user) {
      user.status = 'blocked';
      await user.save();
    }
  }
}

const authService = new AuthService();

export default authService;
