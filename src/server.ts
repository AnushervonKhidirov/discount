import Elysia from 'elysia';
import swagger from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './user/user.router';
import { CompanyRouter } from './company/company.router';
import { BankRouter } from './bank/bank.router';
import { UploadRouter } from './upload/upload.router';
import { BenefitRouter } from './benefit/benefit.router';
import { StoreRouter } from './store/store.router';

const PORT = process.env.PORT ?? 4000;

const app = new Elysia();

app.use(swagger());
app.use(cors());

app.use(AuthRouter);
app.use(UserRouter);
app.use(CompanyRouter);
app.use(BankRouter);
app.use(UploadRouter);
app.use(BenefitRouter);
app.use(StoreRouter);

app.listen(PORT);
