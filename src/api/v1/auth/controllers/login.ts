import { Request, Response, NextFunction } from 'express';
import authService from '../../../../lib/auth';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await authService.login({
      email,
      password,
      issuedIp: req.clientIp || 'N/A',
    });

    const response = {
      code: 200,
      message: 'Login successful',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      links: {
        self: req.url,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default login;
