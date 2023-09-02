import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../../../../lib/workoutPlan';

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // extract data from client request
  const { name, mode, equipment, exercises, trainerTips, photo, status } = req.body;

  try {
    // call the service function
    const workout: any = await workoutPlanService.create({
      name,
      mode,
      equipment,
      exercises,
      trainerTips,
      photo,
      status,
      builder: req.user,
    });

    // generate response
    const response = {
      code: 201,
      message: 'Workout Plan Created Successfully',
      data: { ...workout },
      links: {
        self: `/workouts/${workout.id}`,
        builder: `/workouts/${workout.id}/builder`,
        progress: `/workouts/${workout.id}/progress`,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default create;
