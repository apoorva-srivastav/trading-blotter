import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [OrdersModule],
  providers: [OrdersGateway],
})
export class WebsocketModule {}
