import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { CompanyModule } from 'src/company/company.module';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [PrismaModule, TokenModule, CompanyModule],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
