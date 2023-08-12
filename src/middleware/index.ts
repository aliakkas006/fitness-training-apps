import express from 'express';
import cors from 'cors';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import { middleware } from 'express-openapi-validator';
import authenticate from './authenticate';

const swaggerDoc = YAML.load('./swagger.yaml');

const applyMiddleware = (app: any) => {
  app.use(express.json());
  app.use(cors());
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

  app.use(
    middleware({
      apiSpec: './swagger.yaml',
    }),
  );

  app.use(authenticate);
};

export default applyMiddleware;
