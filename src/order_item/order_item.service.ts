import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/orders/entities/order.entity';
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
          order,
          product: item.product,
        });
      });

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

  async createOrderItem(order: Order, cartItem: CartItem[]) {
    await this.createMany(order, cartItem);
  }

  create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem';
  }

  findAll() {
    return `This action returns all orderItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
