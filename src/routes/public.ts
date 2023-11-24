import { Router } from 'express';
import authControllers from '../api/v1/auth';
import workoutControllers from '../api/v1/workout';
import uploadFile from '../api/v1/upload/controllers/uploadFile';
import handleUpload from '../middleware/handleUpload';

const publicRouter = Router();

// Auth routes
publicRouter
  .post('/api/v1/auth/register', authControllers.register)
  .post('/api/v1/auth/login', authControllers.login)
  .post('/api/v1/auth/logout', authControllers.logout);

// WorkoutPlan routes
publicRouter.get('/api/v1/workouts', workoutControllers.findAllItems);
publicRouter.get('/api/v1/workouts/:id', workoutControllers.findSingleItem);

// Upload route
publicRouter.post('/api/v1/files', handleUpload, uploadFile);

export default publicRouter;
