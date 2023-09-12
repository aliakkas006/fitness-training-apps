import { Request, Response, NextFunction } from 'express';
import tokenService from '../../../../lib/token';

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    await tokenService.revokeRefreshToken({ token, clientIp: req.clientIp || 'N/A' });
    
    res.status(201).json({ message: 'Logout Successfully!' });
  } catch (err) {
    next(err);
  }
};

export default logout;
