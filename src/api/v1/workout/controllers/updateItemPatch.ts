import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../../../../lib/workoutPlan';

const updateItemPatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const  workoutPlan  = await workoutPlanService.updateProperties(id, req.body);

    const response = {
      code: 200,
      messgage: 'Workout plan updated successfully',
      data: workoutPlan,
      links: {
        self: `workouts/${workoutPlan.id}`,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default updateItemPatch;
