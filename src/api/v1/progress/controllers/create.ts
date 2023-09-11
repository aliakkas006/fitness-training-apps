import { Request, Response, NextFunction } from 'express';
import progressService from '../../../../lib/progress';

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { workoutSession, trackProgress, performance, workoutId, status } = req.body;
  

  try {
    // call the service function
    const progress = await progressService.create({
      workoutSession,
      trackProgress,
      performance,
      workoutId,
      status,
      builder: req.user
    });

    // generate response
    const response = {
      code: 201,
      message: 'Progress Created Successfully',
      data: progress,
      links: {
        self: req.url,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default create;
