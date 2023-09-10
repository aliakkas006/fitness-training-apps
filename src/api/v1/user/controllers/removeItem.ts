import { Request, Response, NextFunction } from 'express';
import userService from '../../../../lib/user';

const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await userService.removeItem(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default removeItem;
