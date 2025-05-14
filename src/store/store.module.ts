import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [PrismaModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
