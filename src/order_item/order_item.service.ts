import { Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';

import { OrderItemRepository } from './order_item.repository';

import { ProductsService } from 'src/products/products.service';
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
      await Promise.all(
        cartItems.map(async (item) => {
          // Need created a entity before save
          const newOrderItem = this.orderItemRepository.create({
            quantity: item.quantity,
            price: item.product.price * item.quantity,
            product_name: item.product.name,
            product_price: item.product.price,
            product_image: item.product.image,
            order,
            product: item.product,
          });
          return await queryRunner.manager.save(newOrderItem);
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async updateManyProductWithEachOrderItem(orderItems: OrderItem[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await Promise.all(
        orderItems.map(async (item) => {
          // cập nhập lại số lượng từng sản phẩm.
          return await this.productsService.reduceTheNumberOfProduct(
            item.product.id,
            item.quantity,
            true,
          );
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async createOrderItem(order: Order, cartItems: CartItem[]) {
    return await this.createMany(order, cartItems);
  }

  async removeMany(orderItems: OrderItem[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await Promise.all(
        orderItems.map(
          async (item) => await this.orderItemRepository.softDelete(item.id),
        ),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async removeById(id: string) {
    return await this.orderItemRepository.softDelete(id);
  }

  async getAllByOrder(order: Order) {
    return await this.orderItemRepository.find({
      relations: ['product'],
      where: { order },
      withDeleted: true,
    });
  }

  async findOne(
    id: string,
    withDeleted: boolean,
    orderId: string,
    productId: string,
  ): Promise<OrderItem> {
    const builder = this.orderItemRepository.createQueryBuilder('order_item');

    builder
      .select('order_item')
      .leftJoinAndSelect('order_item.product', 'product')
      .leftJoinAndSelect('order_item.order', 'order')
      .andWhere('order_item.productId = :productId', { productId })
      .andWhere('order_item.orderId = :orderId', { orderId });

    if (withDeleted) {
      builder.withDeleted();
    } else {
    }

    const orderItem = await builder.getOne();

    if (!orderItem)
      throw new NotFoundException('Không tìm thấy sản phẩm trong hóa đơn');
    return orderItem;
  }

  async updateQuantityOfItem(
    orderItemId: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ) {
    const { orderId, productId } = updateOrderItemDto;

    let orderItem = await this.findOne(orderItemId, true, orderId, productId);

    // tính toán cập nhập tăng hoặc giảm số lượng
    if (updateOrderItemDto.quantity !== 0 && !updateOrderItemDto.quantity) {
      updateOrderItemDto.quantity = Number(orderItem.quantity) + 1;
    } else {
      updateOrderItemDto.quantity = Number(updateOrderItemDto.quantity);
    }
    orderItem = { ...orderItem, ...updateOrderItemDto };
    return await this.orderItemRepository.save(orderItem);
  }

  async findLimitBestSellers(query) {
    const builder = this.orderItemRepository.createQueryBuilder('order_item');
    builder
      .select('SUM(order_item.quantity) AS total_of_quantity, product.*')
      .leftJoinAndSelect('order_item.product', 'product')
      .addGroupBy('order_item.productId')
      .addGroupBy('product.id');
    // .addGroupBy('order_item.id');

    // pagination
    const page = parseInt(query?.page) || 1;
    const perPage = parseInt(query?.per_page) || 8;
    //* OFFSET may not work as you may expect if you are using complex queries with joins or subqueries.
    //* If you are using pagination, it's recommended to use *skip* instead.
    // builder.offset((page - 1) * perPage).limit(perPage);
    builder.skip((page - 1) * perPage).take(perPage);

    return await builder.getRawMany();
  }
}
