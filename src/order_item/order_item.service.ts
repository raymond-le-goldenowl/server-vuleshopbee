import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { Connection } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { OrderItemRepository } from './order_item.repository';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemRepository)
    private orderItemRepository: OrderItemRepository,
    private connection: Connection,
    private productsService: ProductsService,
  ) {}

  async createMany(order: Order, cartItem: CartItem[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      cartItem.forEach(async (item) => {
        await this.orderItemRepository.save({
          quantity: item.quantity,
          price: item.product.price * item.quantity,
          product_name: item.product.name,
          product_price: item.product.price,
          product_image: item.product.image,
          order,
          product: item.product,
        });

        await this.productsService.reduceTheNumberOfProducts(
          item.product.id,
          item.quantity,
        );
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async createOrderItem(order: Order, cartItem: CartItem[]) {
    await this.createMany(order, cartItem);
  }
}
