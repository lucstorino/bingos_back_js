import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { BingosModule } from './bingos/bingos.module';
import { CardsModule } from './cards/cards.module';
import { CustomersModule } from './customers/customers.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PrismaModule,
    CardsModule,
    BingosModule,
    CustomersModule,
    ReservationsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
