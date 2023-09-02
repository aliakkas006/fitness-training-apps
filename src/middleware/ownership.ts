import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../lib/workoutPlan';
import { authorizationError } from '../utils/CustomError';

// TODO: check ownership for progress track, profile, user model

const ownership =
  (model = '') =>
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: use swith case for all model

    if (model === 'WorkoutPlan') {
      const isOwner = await workoutPlanService.checkOwnership({
        resourceId: req.params.id,
        userId: req.user.id,
      });

      if (isOwner) next();
      else next(authorizationError);
    }
  };

export default ownership;
