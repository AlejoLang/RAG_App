import { Elysia } from 'elysia';
import { httpRoutes } from './src/http.routes';
import cors from '@elysiajs/cors';
import { rateLimitModule } from './src/utils/rateLimit';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new Elysia()
  .use(cors({
      origin: ["http://localhost:5173", "https://rag-app-frontend-three.vercel.app"],
      credentials: true,
    }))
  .use(rateLimitModule())
  .get('/', () => 'Hello from backend')
  .use(httpRoutes)
  .listen(port);

console.log(`Backend running at http://${app.server?.hostname}:${app.server?.port}`);