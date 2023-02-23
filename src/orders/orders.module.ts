import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { CartsModule } from 'src/carts/carts.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { CartItemModule } from 'src/cart_item/cart_item.module';
import { OrderItemModule } from 'src/order_item/order_item.module';
import { OrderStatusCodeModule } from 'src/order_status_code/order_status_code.module';
import { EmailModule } from 'src/email/email.module';
import { ProductAccountsModule } from 'src/product_accounts/product_accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    CartItemModule,
    CartsModule,
    OrderStatusCodeModule,
    OrderItemModule,
    EmailModule,
    ProductAccountsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
