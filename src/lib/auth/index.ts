import userService from '../user';
import { badRequest } from '../../utils/error';
import { generateHash, hashMatched } from '../../utils/hashing';
import tokenService from '../../lib/token';
import { LoginParam, RegisterParam, RotateRefreshTokenParam } from '../../types/interfaces';
import User from '../../model/User';

class AuthService {
  /**
   * Registers a new user with the provided name, email, and password.
   * @param {RegisterParam} params - Registration parameters including name, email, and password.
   * @returns {Promise<User>} - The newly created user.
   * @throws {Error} - Throws an error if the user already exists.
   */
  public async register({ name, email, password }: RegisterParam): Promise<User> {
    const hasUser = await userService.userExist(email);
    if (hasUser) {
      throw badRequest('User already exists');
    }

    const hashedPassword = await generateHash(password);
    const user = await userService.createAccount({ name, email, password: hashedPassword });

    return user;
  }

  /**
   * Authenticates a user and generates access and refresh tokens.
   * @param {LoginParam} params - Login parameters including email, password, and issued IP.
   * @returns {Promise<{ accessToken: string, refreshToken: string }>} - Access and refresh tokens.
   * @throws {Error} - Throws an error if the credentials are invalid.
   */
  public async login({
    email,
    password,
    issuedIp,
  }: LoginParam): Promise<{ accessToken: string; refreshToken: string }> {
    const user: any = await userService.findUserByEmail(email);
    if (!user) {
      throw badRequest('Invalid credentials');
    }

    const isPasswordValid = await hashMatched(password, user.password);
    if (!isPasswordValid) {
      throw badRequest('Invalid credentials');
    }

    // Generate access token
    const accessTokenPayload = {
      id: user,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = tokenService.generateAccessToken({ payload: accessTokenPayload });

    // Generate refresh token
    const refreshTokenPayload = {
      userId: user,
      issuedIp,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const refreshToken = await tokenService.generateRefreshToken(refreshTokenPayload);

    // Update user status to 'approved' if previously blocked
    if (user.status === 'blocked') {
      user.status = 'approved';
      await user.save();
    }

    return { accessToken, refreshToken };
  }

  /**
   * Logs out a user by revoking the refresh token and blocking the user status.
   * @param {RotateRefreshTokenParam} params - Parameters including token and client IP.
   * @returns {Promise<void>}
   */
  public async logout({ token, clientIp }: RotateRefreshTokenParam): Promise<void> {
    // Revoke the refresh token
    const revokedToken = await tokenService.revokeRefreshToken({ token, clientIp });

    // Block the user status
    const user: any = await User.findById(revokedToken.user);
    if (user) {
      user.status = 'blocked';
      await user.save();
    }
  }
}

// Create an instance of AuthService
const authService = new AuthService();

export default authService;
