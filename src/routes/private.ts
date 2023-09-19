import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import ownership from '../middleware/ownership';
import workoutControllers from '../api/v1/workout';
import progressControllers from '../api/v1/progress';
import profileControllers from '../api/v1/profile';

const privateRouter = Router();

// WorkoutPlan routes
privateRouter.post(
  '/api/v1/workouts',
  [authenticate, authorize(['user', 'admin'])],
  workoutControllers.create
);
privateRouter
  .route('/api/v1/workouts/:id')
  .put(
    [authenticate, authorize(['user', 'admin']), ownership('WorkoutPlan')],
    workoutControllers.updateItem
  )
  .patch(
    [authenticate, authorize(['user', 'admin']), ownership('WorkoutPlan')],
    workoutControllers.updateItemPatch
  )
  .delete(
    [authenticate, authorize(['user', 'admin']), ownership('WorkoutPlan')],
    workoutControllers.removeItem
  );

// TODO: Progress route
privateRouter.get(
  '/api/v1/progress',
  [authenticate, authorize(['user', 'admin'])],
  progressControllers.findAllItems
);

privateRouter.post(
  '/api/v1/progress',
  [authenticate, authorize(['user', 'admin'])],
  progressControllers.create
);
privateRouter
  .route('/api/v1/progress/:id')
  .patch(
    [authenticate, authorize(['user', 'admin']), ownership('Progress')],
    progressControllers.updateItemPatch
  )
  .delete(
    [authenticate, authorize(['user', 'admin']), ownership('Progress')],
    progressControllers.removeItem
  );

// Profile routes
privateRouter.post(
  '/api/v1/profiles',
  [authenticate, authorize(['user', 'admin'])],
  profileControllers.create
);
privateRouter
  .route('/api/v1/profiles/:id')
  .get(
    // [authenticate, authorize(['user', 'admin']), ownership('Profile')],
    profileControllers.findSingleItem
  )
  .patch(
    [authenticate, authorize(['user', 'admin']), ownership('Profile')],
    profileControllers.updateItemPatch
  )
  .delete(
    [authenticate, authorize(['user', 'admin']), ownership('Profile')],
    profileControllers.removeItem
  );

export default privateRouter;
