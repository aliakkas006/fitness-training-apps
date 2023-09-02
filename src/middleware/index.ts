import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import { middleware } from 'express-openapi-validator';

const swaggerDoc = YAML.load('./swagger.yaml');

const applyMiddleware = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use(
    middleware({
      apiSpec: './swagger.yaml',
    })
  );
};

export default applyMiddleware;
