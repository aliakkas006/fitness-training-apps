import { Router } from 'express';
import authControllers from '../api/v1/auth';
import workoutControllers from '../api/v1/workout';

const publicRouter = Router();

// Auth routes
publicRouter
  .post('/api/v1/auth/register', authControllers.register)
  .post('/api/v1/auth/login', authControllers.login);

// WorkoutPlan routes
publicRouter.route('/api/v1/workouts').get(workoutControllers.findAllItems);
publicRouter.route('/api/v1/workouts/:id').get(workoutControllers.findSingleItem);

export default publicRouter;
