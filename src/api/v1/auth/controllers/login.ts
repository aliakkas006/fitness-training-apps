import { Request, Response, NextFunction } from 'express';
import authService from '../../../../lib/auth';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const accessToken = await authService.login({ email, password });
    
    const response = {
      code: 200,
      message: 'Login successful',
      data: {
        access_token: accessToken,
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
