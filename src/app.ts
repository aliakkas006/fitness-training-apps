import express, { Application, NextFunction, Request, Response } from 'express';
import applyMiddleware from './middleware';
import routes from './routes';
import logger from './config/logger';

// Express application
const app: Application = express();
applyMiddleware(app);
app.use(routes);

app.get('/health', (_req: Request, res: Response) => {
  res.send({ health: 'Everything is OK!' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    correlationId: req.headers['x-correlation-id'],
    errors: err.errors,
  });
});

export default app;
