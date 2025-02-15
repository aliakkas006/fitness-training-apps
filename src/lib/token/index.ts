import jwt from 'jsonwebtoken';
import { addDays } from 'date-fns';
import RefreshToken from '../../model/RefrershToken';
import defaults from '../../config/defaults';
import { authenticationError, serverError } from '../../utils/error';
import logger from '../../config/logger';
import { RefreshTokenParam, RotateRefreshTokenParam, TokenPayload } from '../../types/interfaces';
import { Role } from '../../types/enums';

class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'secret-access-token';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'secret-refresh-token';
  }

  /**
   * Generates an access token.
   * @param {Object} params - Parameters including payload, secret, algorithm, and expiresIn.
   * @returns {string} - The generated access token.
   * @throws {Error} - Throws a server error if token generation fails.
   */
  public generateAccessToken({
    payload,
    secret = this.accessTokenSecret,
    algorithm = defaults.algorithm,
    expiresIn = defaults.expiresIn,
  }: {
    payload: TokenPayload;
    secret?: string;
    algorithm?: string;
    expiresIn?: string | number;
  }) {
    try {
      return jwt.sign(payload, secret, { algorithm, expiresIn });
    } catch (err) {
      logger.error('[JWT] Error generating access token:', err);
      throw serverError();
    }
  }

  /**
   * Decodes a token.
   * @param {string} token - The token to decode.
   * @returns {TokenPayload | null} - The decoded token payload or null if decoding fails.
   */
  public decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (err) {
      logger.error('[JWT] Error decoding token:', err);
      throw serverError();
    }
  }

  /**
   * Verifies a token.
   * @param {string} token - The token to verify.
   * @param {string} secret - The secret key to verify the token.
   * @param {string} algorithm - The algorithm used for verification.
   * @returns {TokenPayload} - The verified token payload.
   * @throws {Error} - Throws an authentication error if verification fails.
   */
  public verifyToken({
    token,
    secret = this.accessTokenSecret,
  }: {
    token: string;
    secret?: string;
    algorithm?: string;
  }): TokenPayload {
    try {
      return jwt.verify(token, secret, { algorithms: ['HS256'] }) as unknown as TokenPayload;
    } catch (err) {
      logger.error('[JWT] Error verifying token:', err);
      throw authenticationError('Invalid or expired token');
    }
  }

  /**
   * Generates a refresh token and saves it to the database.
   * @param {RefreshTokenParam} params - Parameters including userId, issuedIp, name, email, and role.
   * @returns {Promise<string>} - The generated refresh token.
   */
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

    const payload: TokenPayload = {
      id: refreshToken.id,
      user: userId,
      name,
      email,
      role,
    };

    const rToken = this.generateAccessToken({
      payload,
      secret: this.refreshTokenSecret,
      expiresIn: '30d',
    });

    refreshToken.token = rToken;
    await refreshToken.save();

    return rToken;
  }

  /**
   * Finds a refresh token by its ID.
   * @param {string} token - The refresh token to find.
   * @returns {Promise<RefreshToken | null>} - The found refresh token or null if not found.
   */
  private async findRefreshToken(token: string): Promise<typeof RefreshToken | null> {
    const decoded = this.verifyToken({
      token,
      secret: this.refreshTokenSecret,
    });

    return RefreshToken.findById(decoded.id);
  }

  /**
   * Revokes a refresh token.
   * @param {RotateRefreshTokenParam} params - Parameters including token and clientIp.
   * @returns {Promise<RefreshToken>} - The revoked refresh token.
   * @throws {Error} - Throws an authentication error if the token is invalid or already revoked.
   */
  public async revokeRefreshToken({
    token,
    clientIp,
  }: RotateRefreshTokenParam): Promise<typeof RefreshToken> {
    const refreshToken: any = await this.findRefreshToken(token);

    if (!refreshToken || !refreshToken.isActive) {
      throw authenticationError('Invalid or revoked token');
    }

    refreshToken.revokedAt = new Date();
    refreshToken.revokedIp = clientIp;

    return refreshToken.save();
  }

  /**
   * Rotates a refresh token by revoking the old one and generating a new one.
   * @param {RotateRefreshTokenParam} params - Parameters including token and clientIp.
   * @returns {Promise<{ accessToken: string, refreshToken: string }>} - The new access and refresh tokens.
   */
  public async rotateRefreshToken({
    token,
    clientIp,
  }: RotateRefreshTokenParam): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = this.verifyToken({
      token,
      secret: this.refreshTokenSecret,
    });

    // Revoke the old refresh token
    await this.revokeRefreshToken({ token, clientIp });

    // Generate a new refresh token
    const refreshToken = await this.generateRefreshToken({
      userId: decoded.user || '',
      issuedIp: clientIp,
      name: decoded.name || '',
      email: decoded.email || '',
      role: decoded.role || Role.USER,
    });

    // Generate a new access token
    const payload: TokenPayload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
    const accessToken = this.generateAccessToken({ payload, expiresIn: defaults.expiresIn });

    return { accessToken, refreshToken };
  }

  /**
   * Checks the validity of a refresh token.
   * @param {string} token - The refresh token to check.
   * @returns {Promise<boolean>} - True if the token is valid, otherwise false.
   * @throws {Error} - Throws an authentication error if the token is invalid.
   */
  public async checkRefreshTokenValidity(token: string): Promise<boolean> {
    const refreshToken: any = await this.findRefreshToken(token);

    if (!refreshToken || !refreshToken.isActive) {
      throw authenticationError('Invalid or revoked token');
    }
    return true;
  }
}

const tokenService = new TokenService();

export default tokenService;
