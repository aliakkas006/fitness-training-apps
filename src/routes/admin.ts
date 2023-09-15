import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import userControllers from '../api/v1/user';
import profileControllers from '../api/v1/profile';
import progressControllers from '../api/v1/progress';
import tokenControllers from '../api/v1/token';
import ownership from '../middleware/ownership';

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
adminRouter
  .route('/api/v1/profiles')
  .get([authenticate, authorize()], profileControllers.findAllItems);

// progress route
adminRouter
  .route('/api/v1/progress')
  .get(
    [authenticate, authorize(['user', 'admin'])],
    progressControllers.findAllItems
  );

// Token routes
adminRouter
  .post('/api/v1/tokens/refresh', [authenticate, authorize()], tokenControllers.refresh)
  .post('/api/v1/tokens/revoke', [authenticate, authorize()], tokenControllers.revoke)
  .post('/api/v1/tokens/validate', [authenticate, authorize()], tokenControllers.validate);

export default adminRouter;
