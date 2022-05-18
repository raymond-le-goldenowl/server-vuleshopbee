import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderItemModule } from 'src/order_item/order_item.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrderItemModule, OrdersModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
