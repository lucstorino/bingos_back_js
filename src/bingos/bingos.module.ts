import { Module } from '@nestjs/common';
import { BingosService } from './bingos.service';
import { BingosController } from './bingos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [PrismaModule, CardsModule],
  controllers: [BingosController],
  providers: [BingosService],
  exports: [BingosService],
})
export class BingosModule {}
