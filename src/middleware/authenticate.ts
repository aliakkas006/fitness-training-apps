import { Request, Response, NextFunction } from 'express';
import tokenService from '../lib/token';
import userService from '../lib/user';
import { authenticationError } from '../utils/CustomError';
import { IUser } from '../model/User';

interface User extends IUser {
  id: string;
}

// Augment the Request type to include the 'user' property
declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded: any = tokenService.verifyToken({ token });
    const user: any = await userService.findUserByEmail(decoded.email);

    if (!user) next(authenticationError());
    if (user.status !== 'approved') next(authenticationError(`Your account is ${user.status}`));

    req.user = { ...user._doc, id: user.id };
    next();
  } catch (err) {
    next(authenticationError());
  }
};

export default authenticate;
