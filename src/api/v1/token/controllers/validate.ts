import { Request, Response, NextFunction } from 'express';
import tokenService from '../../../../lib/token';
import { authenticationError } from '../../../../utils/CustomError';

const validate = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    // process: validate token

    const refreshToken = await tokenService.findRefreshToken(token);
    if (!refreshToken || !refreshToken.isActive) throw authenticationError('Invalid Token');

    // generate response
    res.status(200).json({ message: 'Token is valid!' });
  } catch (err) {
    next(err);
  }
};

export default validate;
