import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { CompanyModule } from 'src/company/company.module';
import { BenefitController } from './benefit.controller';
import { BenefitService } from './benefit.service';

@Module({
  imports: [PrismaModule, TokenModule, CompanyModule],
  controllers: [BenefitController],
  providers: [BenefitService],
})
export class BenefitModule {}
