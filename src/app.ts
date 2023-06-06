import express from 'express';
import cors from 'cors';

const app = express();

app.use([express.json(), cors()]);

app.get('/health', (_req, res) => {
    res.send('Everythig is OK!');
  });

export default app;
