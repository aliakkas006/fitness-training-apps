import jwt from 'jsonwebtoken';
import { addDays } from 'date-fns';
import RefreshToken from '../../model/RefrershToken';
import defaults from '../../config/defaults';
import { serverError } from '../../utils/CustomError';
import logger from '../../config/logger';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

interface RefreshTokenParam {
  userId: string;
  issuedIp: string;
  name: string;
  email: string;
  role: Role;
}

class TokenService {
  private accessToken: string;
  private refreshToken: string;

  constructor() {
    this.accessToken = process.env.ACCESS_TOKEN_SECRET || 'secret-access-token';
    this.refreshToken = process.env.REFRESH_TOKEN_SECRET || 'secret-refresh-token';
  }

  // generate access token:
  public generateToken({
    payload,
    secret = this.accessToken,
    algorithm = defaults.algorithm,
    expiresIn = defaults.expiresIn,
  }: any): string {
    try {
      return jwt.sign(payload, secret, { algorithm, expiresIn });
    } catch (err) {
      logger.error('[JWT]', err);
      throw serverError();
    }
  }

  decodeToken({ token, algorithm = 'HS256' }: any) {
    try {
      return jwt.decode(token, algorithm);
    } catch (err) {
      logger.err('[JWT]', err);
      throw serverError();
    }
  }

  verifyToken({ token, secret = this.accessToken || 'secret-token', algorithm = 'HS256' }: any) {
    try {
      return jwt.verify(token, secret, { algorithms: [algorithm] });
    } catch (err) {
      logger.error('[JWT]', err);
      throw serverError();
    }
  }

  // generate refresh token:
  public async generateRefreshToken({
    userId,
    issuedIp,
    name = '',
    email = '',
    role = Role.USER,
  }: RefreshTokenParam) {
    const refreshToken = new RefreshToken({
      user: userId,
      issuedIp,
      token: '',
      expiredAt: addDays(new Date(), 30),
    });

    const payload = {
      id: refreshToken.id,
      user: userId,
      name,
      email,
      role,
    };

    const rToken = this.generateToken({
      payload,
      secret: this.refreshToken,
      expiresIn: '30d',
    });

    refreshToken.token = rToken;
    await refreshToken.save();

    return rToken;
  }

  // find refresh token
  public findRefreshToken(token: string) {
    const decoded: any = this.verifyToken({
      token,
      secret: process.env.REFRESH_TOKEN_SECRET || 'secret-refresh-token',
      expiresIn: '30d',
    });

    return RefreshToken.findById(decoded.id);
  }
}

const tokenService = new TokenService();

export default tokenService;
