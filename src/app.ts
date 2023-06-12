import express, { Request, Response } from 'express';
import cors from 'cors';

const app: express.Application = express();

app.use([express.json(), cors()]);

app.get('/health', (_req: Request, res: Response) => {
  res.send('Everythig is OK!');
});

export default app;
