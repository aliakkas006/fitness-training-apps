import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../../../../lib/workoutPlan';

const findSingleItem = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const expand = req.query.expand || '';

  try {
    const workoutPlan = await workoutPlanService.findSingleItem({ id, expand });

    const response = {
      code: 200,
      message: 'Successfully fetch a workout plan',
      data: workoutPlan,
      links: {
        self: req.url,
        builder: `${req.url}/builder`,
        progress: `${req.url}/progress`,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default findSingleItem;
