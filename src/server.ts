import http from 'http';
import app from './app';
const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  return console.log(`Express server is listening at http://localhost:${port}`);
});
