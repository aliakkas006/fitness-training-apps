import { Request, Response, NextFunction } from 'express';
import userService from '../../../../lib/user';

const findSingleItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await userService.findSingleItem(id);
    const response = {
      code: 200,
      message: 'Successfully fetch a user',
      data: user,
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
