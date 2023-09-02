import { Request, Response, NextFunction } from 'express';
import {authorizationError} from '../utils/CustomError';

const authorize =
  (roles = ['admin']) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.user.role && roles.includes(req.user.role)) {
      next();
    } else {
      next(authorizationError());
    }
  };

export default authorize;
