import { Request, Response, NextFunction } from 'express';
import progressService from '../../../../lib/progress';

const updateItemPatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const progress = await progressService.updateProperties(id, req.body, req.user);
    const response = {
      code: 200,
      message: 'Successfully updated progress property',
      data: progress,
      links: {
        self: req.url,
      },
    };

    res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
};

export default updateItemPatch;
