import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartsModule } from 'src/models/carts/carts.module';
import { CartItemService } from './cart_item.service';
import { CartItemController } from './cart_item.controller';
import { CartItemRepository } from './cart_item.repository';
import { ProductsModule } from 'src/models/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItemRepository]),
    ProductsModule,
    CartsModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
