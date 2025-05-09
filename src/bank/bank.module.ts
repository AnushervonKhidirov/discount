import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadModule } from 'src/upload/upload.module';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';

@Module({
  imports: [PrismaModule, UploadModule],
  providers: [BankService],
  controllers: [BankController],
})
export class BankModule {}
