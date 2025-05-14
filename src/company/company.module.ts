import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { UploadModule } from 'src/upload/upload.module';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [PrismaModule, TokenModule, UploadModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
