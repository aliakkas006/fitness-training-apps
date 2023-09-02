import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import workoutControllers from '../api/v1/workout';
import authControllers from '../api/v1/auth';
import ownership from '../middleware/ownership';

const router = Router();

// TODO: use authenticate, authorize and ownership middleware later based on situation
// Auth routes
router
  .post('/api/v1/auth/register', authControllers.register)
  .post('/api/v1/auth/login', authControllers.login);

// Workout routes
router
  .route('/api/v1/workouts')
  .get(workoutControllers.findAllItems)
  .post(authenticate, authorize(['user', 'admin']), workoutControllers.create);
router
  .route('/api/v1/workouts/:id')
  .get(workoutControllers.findSingleItem)
  .put(authenticate, authorize(['user', 'admin']), workoutControllers.updateItem)
  .patch(authenticate, authorize(['user', 'admin']), workoutControllers.updateItemPatch)
  .delete(
    authenticate,
    authorize(['user', 'admin']),
    ownership('WorkoutPlan'),
    workoutControllers.removeItem
  );

// User routes (admin only)

export default router;
