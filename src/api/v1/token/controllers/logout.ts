import { Request, Response, NextFunction } from 'express';
import { authenticationError } from '../../../../utils/CustomError';
import tokenService from '../../../../lib/token';

const revoke = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    // process

    const refreshToken = await tokenService.findRefreshToken(token)
    if (!refreshToken || !refreshToken.isActive) throw authenticationError('Invalid Token');

    // revoked token
    refreshToken.revokedAt = new Date();
    refreshToken.revokedIp = req.clientIp;
    await refreshToken.save();

    // generate response
    res.status(201).json({ message: 'Revoked Token!' });
  } catch (err) {
    next(err);
  }
};

export default revoke;
