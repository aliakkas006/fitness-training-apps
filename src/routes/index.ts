import { Router } from 'express';
import findAll from '../api/v1/workout/controllers/findAll'
import create from '../api/v1/workout/controllers/create'

const router = Router();

router
  .route('/api/v1/workouts')
  .get(findAll)
  .post(create);

router
  .route('/api/v1/workouts/:id')
  .get(() => {
    console.log('GET by id');
  })
  .patch(() => {
    console.log('PATCH by id');
  })
  .put(() => {
    {
      console.log('PUT by id');
    }
  })
  .delete(() => {
    {
      console.log('DELETE by id');
    }
  });

export default router;
