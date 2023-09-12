import { Request, Response, NextFunction } from 'express';
import tokenService from '../../../../lib/token';

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    // process: rotate refresh token
    const { accessToken, refreshToken } = await tokenService.rotateRefreshToken({
      token,
      clientIp: req.clientIp || 'N/A',
    });
    
    // generate response
    const response = {
      code: 201,
      message: 'Successfully generated a new Access Token and Refresh Token',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      links: {
        self: req.url,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default refresh;
