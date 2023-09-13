import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import ownership from '../middleware/ownership';
import workoutControllers from '../api/v1/workout';
import progressControllers from '../api/v1/progress';
import profileControllers from '../api/v1/profile';

const privateRouter = Router();

// WorkoutPlan routes
privateRouter
  .route('/api/v1/workouts')
  .post([authenticate, authorize(['user', 'admin'])], workoutControllers.create);
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

// Progress routes
// TODO: Check find all items controller
privateRouter
  .route('/api/v1/progress')
  .post([authenticate, authorize(['user', 'admin'])], progressControllers.create);
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
privateRouter
  .route('/api/v1/profiles')
  .post([authenticate, authorize(['user', 'admin'])], profileControllers.create);
privateRouter
  .route('/api/v1/profiles/:id')
  .get(
    [authenticate, authorize(['user', 'admin']), ownership('Profile')],
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
