import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { CartsModule } from 'src/models/carts/carts.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { CartItemModule } from 'src/models/cart_item/cart_item.module';
import { OrderItemModule } from 'src/models/order_item/order_item.module';
import { OrderStatusCodeModule } from 'src/models/order_status_code/order_status_code.module';
import { EmailModule } from 'src/mails/email.module';
import { ProductAccountsModule } from 'src/models/product_accounts/product_accounts.module';

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
