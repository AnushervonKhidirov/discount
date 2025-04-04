import Elysia from 'elysia';
import swagger from '@elysiajs/swagger';
import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './user/user.router';
import { CompanyRouter } from './company/company.router';
import { BankRouter } from './bank/bank.router';
import { UploadRouter } from './upload/upload.router';
import { DiscountRouter } from './discount/discount.router';
import { CashbackRouter } from './cashback/cashback.router';
import { StoreRouter } from './store/store.router';

const PORT = process.env.PORT ?? 4000;

const app = new Elysia();

app.use(swagger());
app.use(AuthRouter);
app.use(UserRouter);
app.use(CompanyRouter);
app.use(BankRouter);
app.use(UploadRouter);
app.use(DiscountRouter);
app.use(CashbackRouter);
app.use(StoreRouter);

app.listen(PORT);
