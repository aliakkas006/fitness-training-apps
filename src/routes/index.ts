import { Router, Request, Response } from 'express';
import authControllers from '../api/v1/auth';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import ownership from '../middleware/ownership';
import tokenControllers from '../api/v1/token';
import workoutControllers from '../api/v1/workout';

const router = Router();

// TODO: use and check authenticate, authorize and ownership middleware later based on situation

router.get('/api/v1/check', (_req: Request, res: Response) => res.send('Check'));

// Auth routes
router
  .post('/api/v1/auth/register', authControllers.register)
  .post('/api/v1/auth/login', authControllers.login);

// Token routes
router
  .post('/api/v1/tokens/refresh', authenticate, authorize(), tokenControllers.refresh)
  .post('/api/v1/tokens/revoke', authenticate, authorize(), tokenControllers.revoke)
  .post('/api/v1/tokens/validate', authenticate, authorize(), tokenControllers.validate);

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
