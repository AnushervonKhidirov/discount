import Elysia from 'elysia';
import swagger from '@elysiajs/swagger';
import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './user/user.router';
import { CompanyRouter } from './company/company.router';
import { BankRouter } from './bank/bank.router';
import { UploadRouter } from './upload/upload.router';

const PORT = process.env.PORT ?? 4000;

const app = new Elysia();

app.use(swagger());
app.use(AuthRouter);
app.use(UserRouter);
app.use(CompanyRouter);
app.use(BankRouter);
app.use(UploadRouter);

app.listen(PORT);
