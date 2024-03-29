import { Request, Response, NextFunction } from 'express';
import workoutPlanService from '../lib/workoutPlan';
import { authorizationError } from '../utils/error';
import progressService from '../lib/progress';
import profileService from '../lib/profile';

const ownership =
  (model = '') =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const resourceId = req.params.id;
    const userId = req.user.id;
    let isOwner = false;

    switch (model) {
      case 'WorkoutPlan':
        isOwner = await workoutPlanService.checkOwnership({ resourceId, userId });
        break;

      case 'Progress':
        isOwner = await progressService.checkOwnership({ resourceId, userId });
        break;

      default:
        // Profile
        isOwner = await profileService.checkOwnership({ resourceId, userId });
        break;
    }

    if (isOwner || (req.user.role === 'admin' && req.user.status === 'approved')) next();
    else next(authorizationError());
  };

export default ownership;
