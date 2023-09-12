import jwt from 'jsonwebtoken';
import { addDays } from 'date-fns';
import RefreshToken from '../../model/RefrershToken';
import defaults from '../../config/defaults';
import { authenticationError, serverError } from '../../utils/CustomError';
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

interface RotateRefreshTokenParam {
  token: string;
  clientIp: string;
}

class TokenService {
  private accessToken: string;
  private refreshToken: string;

  constructor() {
    this.accessToken = process.env.ACCESS_TOKEN_SECRET || 'secret-access-token';
    this.refreshToken = process.env.REFRESH_TOKEN_SECRET || 'secret-refresh-token';
  }

  public generateAccessToken({
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

  decodeToken({ token, algorithm = defaults.algorithm }: any) {
    try {
      return jwt.decode(token, algorithm);
    } catch (err) {
      logger.err('[JWT]', err);
      throw serverError();
    }
  }

  public verifyToken({ token, secret = this.accessToken, algorithm = defaults.algorithm }: any) {
    try {
      return jwt.verify(token, secret, { algorithms: [algorithm] });
    } catch (err) {
      logger.error('[JWT]', err);
      throw serverError();
    }
  }

  public async generateRefreshToken({
    userId,
    issuedIp,
    name = '',
    email = '',
    role = Role.USER,
  }: RefreshTokenParam): Promise<string> {
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

    const rToken = this.generateAccessToken({
      payload,
      secret: this.refreshToken,
      expiresIn: '30d',
    });

    refreshToken.token = rToken;
    await refreshToken.save();

    return rToken;
  }

  private findRefreshToken(token: string) {
    const decoded: any = this.verifyToken({
      token,
      secret: this.refreshToken,
      expiresIn: '30d',
    });

    return RefreshToken.findById(decoded.id);
  }

  // Revoked refresh token
  public async revokeRefreshToken({ token, clientIp }: RotateRefreshTokenParam) {
    const refreshToken = await this.findRefreshToken(token);
    if (!refreshToken || !refreshToken.isActive) throw authenticationError('Invalid Token!');

    refreshToken.revokedAt = new Date();
    refreshToken.revokedIp = clientIp;

    return refreshToken.save();
  }

  // Rotate refresh token
  public async rotateRefreshToken({ token, clientIp }: RotateRefreshTokenParam) {
    const decoded: any = this.verifyToken({
      token,
      secret: this.refreshToken,
      expiresIn: '30d',
    });

    // revoked old refresh token
    await this.revokeRefreshToken({ token, clientIp });

    // generate a new refresh token
    const refreshToken = await this.generateRefreshToken({
      userId: decoded.user,
      issuedIp: clientIp,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    });

    // generate a new access token
    const payload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
    const accessToken = this.generateAccessToken({ payload, expiresIn: defaults.expiresIn });

    return { accessToken, refreshToken };
  }

  // Check refresh token validity
  public async checkRefreshTokenValidity(token: string): Promise<boolean> {
    const refreshToken = await tokenService.findRefreshToken(token);
    if (!refreshToken || !refreshToken.isActive) throw authenticationError('Invalid Token');
    else return true;
  }
}

const tokenService = new TokenService();

export default tokenService;
