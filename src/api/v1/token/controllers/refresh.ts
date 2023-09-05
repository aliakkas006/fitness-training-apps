import { Request, Response, NextFunction } from 'express';
import tokenService from '../../../../lib/token';
import { authenticationError } from '../../../../utils/CustomError';

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    // process: rotate refresh token

    const decoded: any = tokenService.verifyToken({
      token,
      secret: process.env.REFRESH_TOKEN_SECRET || 'secret-refresh-token',
      expiresIn: '30d',
    });

    const oldRefreshToken = await tokenService.findRefreshToken(token);
    if (!oldRefreshToken || !oldRefreshToken.isActive) throw authenticationError('Invalid Token!');

    // revoked old refresh token
    oldRefreshToken.revokedAt = new Date();
    oldRefreshToken.revokedIp = req.clientIp;
    await oldRefreshToken.save();

    // generate a new refresh token:
    const refreshToken = await tokenService.generateRefreshToken({
      userId: decoded.user,
      issuedIp: req.clientIp || 'N/A',
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
    const accessToken = tokenService.generateToken({ payload, expiresIn: '1h' });

    // generate response
    const response = {
      code: 201,
      message: 'Successfully generated a new Access Token and Refresh Token',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      links: {
        self: req.url,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default refresh;
