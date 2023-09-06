import express, { Application, NextFunction, Request, Response } from 'express';
import applyMiddleware from './middleware';
import routes from './routes';
import logger from './config/logger';

// express application
const app: Application = express();
applyMiddleware(app);
app.use(routes);

app.get('/health', (_req: Request, res: Response) => {
  res.send({ health: 'Everything is OK!' });
});

// register an error handler using express-openapi-validator
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;

/* 
 app.get('/api/v1/workouts', async (req: Request, res: Response) => {
  // 1. extract query params
  const page: number = +(req.query.page as string) || 1;
  const limit: number = +(req.query.limit as string) || 10;
  const sortType: string = (req.query.sort_type as string) || 'dsc';
  const sortBy: string = (req.query.sort_by as string) || 'updatedAt';
  const searchTerm: string = (req.query.search as string) || '';

  // 2. call workouts service to fetch all workouts plan
  const db = await connection.getDB();
  // console.log('db', db);
  // console.log('connection', connection);

  const workoutsPlan = db.workoutsPlan;
  // console.log('workouts plan', workoutsPlan);

  // {
  //   "data": [
  //     {
  //       "id": 1,
  //       "name": "Heavy DT",
  //       "mode": "5 Rounds For Time",
  //       "equipment": [
  //         "barbell",
  //         "rope"
  //       ],
  //       "exercises": [
  //         "9 deadlifts",
  //         "5 hang power cleans",
  //         "4 push jerks"
  //       ],
  //       "trainerTips": [
  //         "Aim for unbroken push jerks",
  //         "The first three rounds might feel terrible, but stick to it",
  //         "RX Weights - 205lb/145lb"
  //       ],
  //       "photo": "https://s3.aws.com/my-fitness/img.jpg",
  //       "builder": {
  //         "id": 101,
  //         "name": "Ali Akkas"
  //       },
  //       "link": "/workouts/1",
  //       "createdAt": "string",
  //       "updatedAt": "string"
  //     }
  //   ],
  //   "pagination": {
  //     "page": 2,
  //     "limit": 10,
  //     "next": 3,
  //     "prev": 1,
  //     "totalPage": 5,
  //     "totalItems": 10
  //   },
  //   "links": {
  //     "self": "/workouts?page=2&limit=10",
  //     "next": "/workouts?page=3&limit=10",
  //     "prev": "/workouts?page=1&limit=10"
  //   }
  // }

  // 3. generate necessary responses
  const response = {
    data: workoutsPlan,
    pagination: {
      page,
      limit,
      next: 3,
      prev: 1,
      totalPage: Math.ceil(workoutsPlan.length / limit),
      totalItems: workoutsPlan.length,
    },
    links: {
      self: req.url,
      next: `/workouts?page=${page + 1}&limit=${limit}`,
      prev: `/workouts?page=${page - 1}&limit=${limit}`,
    },
  };

  res.status(200).json(response);
});

app.post('/api/v1/workouts', (req: Request, res: Response) => {
  // step->1: destructure the request body
  // const {name, mode, equipment, exercises, trainerTips, photo, status} = req.body

  // step->2: invoke the service function

  // step->3: generate response

  res.status(201).json({ message: 'okay' });
});

*/

/* 
"_moduleAliases": {
    "@/controller": "dist/controller",
    "@/utils": "dist/utils",
    "@/middleware": "dist/middleware",
    "@/logs": "dist/logs",
    "@/routes": "dist/routes",
    "@/service": "dist/service",
    "@/model": "dist/model"
  }
*/
