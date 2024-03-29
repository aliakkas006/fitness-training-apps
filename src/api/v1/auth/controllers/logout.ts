import { Request, Response, NextFunction } from 'express';
import authService from '../../../../lib/auth';

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    await authService.logout({ token, clientIp: req.clientIp || 'N/A' });

    const response = {
      code: 204,
      message: 'Logout Successfully!',
      links: {
        self: req.url,
        login: `/api/v1/auth/login`,
      },
    };

    res.status(204).json(response);
  } catch (err) {
    next(err);
  }
};

export default logout;
