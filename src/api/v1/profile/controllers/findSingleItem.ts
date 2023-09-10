import { Request, Response, NextFunction } from 'express';
import profileService from '../../../../lib/profile';

const findSingleItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const profile = await profileService.findSingleItem(id)
    const response = {
      code: 200,
      message: 'Successfully fetch a profile',
      data: profile,
      links: {
        self: req.url,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default findSingleItem;
