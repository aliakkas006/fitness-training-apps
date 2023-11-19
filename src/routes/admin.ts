import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import userControllers from '../api/v1/user';
import profileControllers from '../api/v1/profile';
import tokenControllers from '../api/v1/token';

const adminRouter = Router();

// User routes
adminRouter
  .route('/api/v1/users')
  .get([authenticate, authorize()], userControllers.findAllItems)
  .post([authenticate, authorize()], userControllers.create);
adminRouter
  .route('/api/v1/users/:id')
  .get([authenticate, authorize()], userControllers.findSingleItem)
  .patch([authenticate, authorize()], userControllers.updateItemPatch)
  .delete([authenticate, authorize()], userControllers.removeItem);
adminRouter.patch(
  '/api/v1/users/:id/password',
  [authenticate, authorize()],
  userControllers.changePassword
);

// Profile route
adminRouter.get('/api/v1/profiles', [authenticate, authorize()], profileControllers.findAllItems);

// Token routes
adminRouter
  .post('/api/v1/tokens/refresh', [authenticate, authorize()], tokenControllers.refresh)
  .post('/api/v1/tokens/validate', [authenticate, authorize()], tokenControllers.validate);

export default adminRouter;
