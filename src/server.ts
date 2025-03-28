import Elysia from 'elysia';
import swagger from '@elysiajs/swagger';
import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './user/user.router';

const PORT = process.env.PORT ?? 4000;

const app = new Elysia();

app.use(swagger());
app.use(AuthRouter);
app.use(UserRouter);

app.listen(PORT);
