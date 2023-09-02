import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../../../../lib/workoutPlan';

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const photo = req.body.photo || '';
  const status = req.body.status || 'progress';

  try {
    const { workoutPlan, code } = await workoutPlanService.updateOrCreate(id, {
      name: req.body.name,
      mode: req.body.mode,
      equipment: req.body.equipment,
      exercises: req.body.exercises,
      trainerTips: req.body.trainerTips,
      photo,
      status,
      builder: req.user,
    });

    const response = {
      code,
      messgage: code === 200 ? 'Workout plan updated successfully' : 'Workout plan creatd successfully',
      data: workoutPlan,
      links: {
        self: `workouts/${workoutPlan.id}`,
      },
    };

    res.status(code).json(response);
  } catch (err) {
    next(err);
  }
};

export default updateItem;
