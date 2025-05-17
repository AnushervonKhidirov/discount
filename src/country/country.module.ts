import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';

@Module({
  imports: [PrismaModule],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
