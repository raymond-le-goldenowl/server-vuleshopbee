import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderItemModule } from 'src/models/order_item/order_item.module';
import { OrdersModule } from 'src/models/orders/orders.module';
import { RawBodyMiddleware } from 'src/middlewares/models/stripe.raw-body.middleware';

@Module({
  imports: [OrderItemModule, OrdersModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes(StripeController);
  }
}
