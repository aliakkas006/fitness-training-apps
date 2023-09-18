import { Request, Response, NextFunction } from 'express';
import authService from '../../../../lib/auth'

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    await authService.logout({ token, clientIp: req.clientIp || 'N/A', user: req.user });

    res.status(201).json({ message: 'Logout Successfully!' });
  } catch (err) {
    next(err);
  }
};

export default logout;
