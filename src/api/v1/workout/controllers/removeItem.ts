import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../../../../lib/workoutPlan';

const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await workoutPlanService.removeItem(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default removeItem;
