import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => 'Hello from backend')
  .listen(3000);

console.log(`Backend running at http://${app.server?.hostname}:${app.server?.port}`);