import { Request, Response, NextFunction } from 'express';
import profileService from '../../../../lib/profile';

const updateItemPatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const profile = await profileService.updateProperties(id, req.body);
    const response = {
      code: 200,
      message: 'Successfully updated',
      data: profile,
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
