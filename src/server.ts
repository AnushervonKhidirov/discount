import Elysia from 'elysia';

const PORT = process.env.PORT ?? 4000;

const app = new Elysia();

app.listen(PORT);
