import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { Connection } from 'typeorm';
import { OrderItem } from './entities/order_item.entity';
import { OrderItemRepository } from './order_item.repository';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemRepository)
    private orderItemRepository: OrderItemRepository,
    private connection: Connection,
    private productsService: ProductsService,
  ) {}

  async createMany(order: Order, cartItems: CartItem[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      cartItems.forEach(async (item) => {
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

  async createOrderItem(order: Order, cartItems: CartItem[]) {
    await this.createMany(order, cartItems);
  }

  async removeMany(orderItems: OrderItem[]) {
    const queryRunner = this.connection.createQueryRunner();

    let runQuery;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      orderItems.forEach(async (item) => {
        await this.orderItemRepository.softDelete(item.id);
      });

      runQuery = await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    return runQuery;
  }

  async removeById(id: string) {
    return await this.orderItemRepository.softDelete(id);
  }

  async getAllByOrderId(order: Order) {
    return await this.orderItemRepository.find({
      relations: ['product'],
      where: { order },
      withDeleted: true,
    });
  }
}
