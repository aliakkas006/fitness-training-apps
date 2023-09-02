import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../../../../lib/workoutPlan';

const findSingleItem = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const expand = req.query.expand || '';

  try {
    const workout = await workoutPlanService.findSingleItem({ id, expand });

    const response = {
      data: workout,
      links: {
        self: `/workouts/${workout.id}`,
        builder: `/workouts/${workout.id}/builder`,
        progress: `/workouts/${workout.id}/progress`,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default findSingleItem;
