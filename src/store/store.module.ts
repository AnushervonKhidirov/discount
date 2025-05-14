import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { CompanyModule } from 'src/company/company.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [PrismaModule, CompanyModule, TokenModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
