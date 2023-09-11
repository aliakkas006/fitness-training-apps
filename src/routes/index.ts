import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import ownership from '../middleware/ownership';
import authControllers from '../api/v1/auth';
import tokenControllers from '../api/v1/token';
import workoutControllers from '../api/v1/workout';
import progressControllers from '../api/v1/progress';
import userControllers from '../api/v1/user';
import profileControllers from '../api/v1/profile';

const router = Router();

// TODO: use and check authenticate, authorize and ownership middleware later based on situation

// TODO: Update ownership middleware based on Model(owner)
// Auth routes
router
  .post('/api/v1/auth/register', authControllers.register)
  .post('/api/v1/auth/login', authControllers.login);

// TODO: tokens route will be in the Auth routes (/api/v1/logout)
// Token routes
router
  .post('/api/v1/tokens/refresh', [authenticate, authorize()], tokenControllers.refresh)
  .post('/api/v1/tokens/logout', [authenticate, authorize()], tokenControllers.logout)
  .post('/api/v1/tokens/validate', [authenticate, authorize()], tokenControllers.validate);

// Workout routes
router
  .route('/api/v1/workouts')
  .get(workoutControllers.findAllItems)
  .post([authenticate, authorize(['user', 'admin'])], workoutControllers.create);

router
  .route('/api/v1/workouts/:id')
  .get(workoutControllers.findSingleItem)
  .put([authenticate, authorize(['user', 'admin'])], workoutControllers.updateItem)
  .patch([authenticate, authorize(['user', 'admin'])], workoutControllers.updateItemPatch)
  .delete(
    [authenticate, authorize(['user', 'admin']), ownership('WorkoutPlan')],
    workoutControllers.removeItem
  );

// Progress routes
// TODO: Check find all items controller
router
  .route('/api/v1/progress')
  .get([authenticate, authorize()], progressControllers.findAllItems)
  .post([authenticate, authorize(['user', 'admin'])], progressControllers.create);

router
  .route('/api/v1/progress/:id')
  .patch([authenticate, authorize(['user', 'admin'])], progressControllers.updateItemPatch)
  .delete(
    [authenticate, authorize(['user', 'admin']), ownership('Progress')],
    progressControllers.removeItem
  );

// User routes (admin only)
// TODO: do user password hash like auth service
router
  .route('/api/v1/users')
  .get([authenticate, authorize()], userControllers.findAllItems)
  .post([authenticate, authorize()], userControllers.create);

router
  .route('/api/v1/users/:id')
  .get([authenticate, authorize()], userControllers.findSingleItem)
  .patch([authenticate, authorize()], userControllers.updateItemPatch)
  .delete([authenticate, authorize()], userControllers.removeItem);

// TODO: do user password hash
router.patch(
  '/api/v1/users/:id/password',
  [authenticate, authorize()],
  userControllers.changePassword
);

// Profile routes
router
  .route('/api/v1/profiles')
  .get([authenticate, authorize()], profileControllers.findAllItems)
  .post([authenticate, authorize(['user', 'admin'])], profileControllers.create);

router
  .route('/api/v1/profiles/:id')
  .get([authenticate, authorize(['user', 'admin'])], profileControllers.findSingleItem)
  .patch([authenticate, authorize(['user', 'admin'])], profileControllers.updateItemPatch)
  .delete([authenticate, authorize(['user', 'admin'])], profileControllers.removeItem);

export default router;
