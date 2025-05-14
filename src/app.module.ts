import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { BankModule } from './bank/bank.module';
import { UploadModule } from './upload/upload.module';
import { CompanyModule } from './company/company.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ScheduledTasksModule,
    PrismaModule,
    AuthModule,
    UserModule,
    TokenModule,
    ScheduledTasksModule,
    BankModule,
    UploadModule,
    CompanyModule,
    StoreModule,
  ],
})
export class AppModule {}
