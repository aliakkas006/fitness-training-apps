import { Request, Response, NextFunction } from 'express';
import tokenService from '../../../../lib/token';

const revoke = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    await tokenService.revokeRefreshToken({ token, clientIp: req.clientIp || 'N/A' });

    res.status(201).json({ message: 'revoke Successfully!' });
  } catch (err) {
    next(err);
  }
};

export default revoke;
