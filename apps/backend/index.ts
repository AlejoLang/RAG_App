import { Elysia } from 'elysia';
import { httpRoutes } from './src/http.routes';
import cors from '@elysiajs/cors';

const app = new Elysia()
  .use(cors({}))
  .get('/', () => 'Hello from backend')
  .use(httpRoutes)
  .listen(3000);

console.log(`Backend running at http://${app.server?.hostname}:${app.server?.port}`);