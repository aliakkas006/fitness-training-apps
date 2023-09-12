import { Request, Response, NextFunction } from 'express';
import tokenService from '../../../../lib/token';

const validate = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    const isValid = await tokenService.checkRefreshTokenValidity(token);

    if (isValid) res.status(200).json({ message: 'Token is valid!' });
  } catch (err) {
    next(err);
  }
};

export default validate;
