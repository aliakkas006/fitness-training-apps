import { Request, Response, NextFunction } from 'express';
import profileService from '../../../../lib/profile';

const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await profileService.removeItem(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default removeItem;
