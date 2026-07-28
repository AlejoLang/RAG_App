import { Elysia } from 'elysia';
import { httpRoutes } from './src/http.routes';
import cors from '@elysiajs/cors';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new Elysia()
  .use(cors({
      origin: ["http://localhost:5173", "https://rag-app-frontend-three.vercel.app"],
      credentials: true,
    }))
  .get('/', () => 'Hello from backend')
  .use(httpRoutes)
  .listen(port);

console.log(`Backend running at http://${app.server?.hostname}:${app.server?.port}`);