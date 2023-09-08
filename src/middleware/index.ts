import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import requestIp from 'request-ip';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import { middleware } from 'express-openapi-validator';

const swaggerDoc = YAML.load('./swagger.yaml');

const applyMiddleware = (app: Application) => {
  app.use([express.json(), cors(), morgan('dev'), requestIp.mw()]);
  
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use(
    middleware({
      apiSpec: './swagger.yaml',
    })
  );
};

export default applyMiddleware;
