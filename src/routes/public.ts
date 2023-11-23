import { Router } from 'express';
import authControllers from '../api/v1/auth';
import workoutControllers from '../api/v1/workout';
import uploadFile from '../api/v1/upload/controllers/uploadFile';
import upload from '../lib/upload';

const publicRouter = Router();

// Auth routes
publicRouter
  .post('/api/v1/auth/register', authControllers.register)
  .post('/api/v1/auth/login', authControllers.login)
  .post('/api/v1/auth/logout', authControllers.logout);

// WorkoutPlan routes
publicRouter.route('/api/v1/workouts').get(workoutControllers.findAllItems);
publicRouter.route('/api/v1/workouts/:id').get(workoutControllers.findSingleItem);

// Upload routes
publicRouter.route('/api/v1/files').post(upload.array('files', 3), uploadFile);

export default publicRouter;
