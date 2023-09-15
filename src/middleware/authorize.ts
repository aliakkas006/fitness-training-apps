import { Request, Response, NextFunction } from 'express';
import { authorizationError } from '../utils/error';

const authorize =
  (roles = ['admin']) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.user.role && roles.includes(req.user.role) && req.user.status === 'approved') {
      next();
    } else {
      next(authorizationError());
    }
  };

export default authorize;
