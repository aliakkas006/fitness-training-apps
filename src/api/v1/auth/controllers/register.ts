import { Request, Response, NextFunction } from 'express';
import authService from '../../../../lib/auth';
import tokenService from '../../../../lib/token';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    const user = await authService.register({ name, email, password });

    // generate access token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = tokenService.generateAccessToken({ payload });

    // generate response
    const response = {
      code: 201,
      message: 'Account Created Successfully',
      data: {
        access_token: accessToken,
      },
      links: {
        self: req.url,
        login: '/api/v1/auth/login',
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default register;
