import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import requestIp from 'request-ip';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import { middleware } from 'express-openapi-validator';
import expressWinstonLogger from './expressWinstonLogger';
import setCorrelationId from './setCorrelationId';

const swaggerDoc = YAML.load('./swagger.yaml');

const applyMiddleware = (app: Application) => {
  app.use([
    express.json(),
    cors(),
    morgan('dev'),
    expressWinstonLogger,
    setCorrelationId,
    requestIp.mw(),
  ]);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use(
    middleware({
      apiSpec: './swagger.yaml',
    })
  );
};

export default applyMiddleware;

// const swaggerDoc = YAML.load('./docs/v1/_build/swagger.yaml')
