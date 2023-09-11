import { Request, Response, NextFunction } from 'express';
import progressService from '../../../../lib/progress';

const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await progressService.removeItem(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default removeItem;
