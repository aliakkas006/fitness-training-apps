
import { Request, Response, NextFunction } from 'express';

// Augment the Request type to include the 'user' property
declare module 'express-serve-static-core' {
  interface Request {
    user: {
      id: string;
      name: string;
    };
  }
}

const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    id: '64d3bce94f18364c6c38689d',
    name: 'Ali Akkas',
  };
  next();
};

export default authenticate;
