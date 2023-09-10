import { Request, Response, NextFunction } from 'express';
import userService from '../../../../lib/user';

const updateItemPatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await userService.updateProperties(id, req.body);
    const response = {
      code: 200,
      message: 'Successfully updated user property',
      data: user,
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
