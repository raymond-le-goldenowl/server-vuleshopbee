import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { Connection } from 'typeorm';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
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

  async updateManyProductWithEachOrderItem(orderItems: OrderItem[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      orderItems.forEach(async (item) => {
        // cập nhập lại số lượng từng sản phẩm.
        await this.productsService.reduceTheNumberOfProduct(
          item.product.id,
          item.quantity,
          true,
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

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      orderItems.forEach(async (item) => {
        const deleted = await this.orderItemRepository.softDelete(item.id);
        if (!deleted) {
          throw new BadRequestException(
            'Thực hiện tính toán sản phẩm trong giỏ hàng không thành công',
          );
        }

        // khi hủy hóa đơn thì tính cập nhập lại số lượng sản phẩm đã thêm vào giỏ hàng.
        // await this.productsService.reduceTheNumberOfProduct(
        //   item.product.id,
        //   item.quantity,
        //   false,
        // );
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
  ) {
    let orderItem: OrderItem;

    try {
      const builder = this.orderItemRepository.createQueryBuilder('order_item');

      builder
        .select('order_item')
        .leftJoinAndSelect('order_item.product', 'product')
        .leftJoinAndSelect('order_item.order', 'order')
        .andWhere('order_item.productId = :productId', { productId })
        .andWhere('order_item.orderId = :orderId', { orderId });

      if (withDeleted) {
        builder.withDeleted();
        orderItem = await builder.getOne();
      } else {
        orderItem = await builder.getOne();
      }
    } catch (error) {
      throw error;
    }

    return orderItem;
  }

  async updateQuantityOfItem(
    orderItemId: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ) {
    let orderItemUpdated: OrderItem;

    const { orderId, productId } = updateOrderItemDto;
    try {
      let orderItem = await this.findOne(orderItemId, true, orderId, productId);

      // // Kiểm tra số lượng sản phẩm còn đủ để thêm vào giỏ hàng hay không
      // if (orderItem.product.amount === 0) {
      //   throw new BadRequestException('Số lượng sản phẩm không đủ');
      // }

      // if (orderItem.product.amount - updateOrderItemDto.quantity < 0) {
      //    throw new BadRequestException(
      //     `Sản phẩm ${orderItem?.product?.name} chỉ còn ${orderItem?.product?.amount}. Vui lòng thay đổi số lượng để phù hợp hơn`,
      //   );
      // }

      // tính toán cập nhập tăng hoặc giảm số lượng
      if (updateOrderItemDto.quantity !== 0 && !updateOrderItemDto.quantity) {
        updateOrderItemDto.quantity = Number(orderItem.quantity) + 1;
      } else {
        updateOrderItemDto.quantity = Number(updateOrderItemDto.quantity);
      }
      orderItem = { ...orderItem, ...updateOrderItemDto };
      orderItemUpdated = await this.orderItemRepository.save(orderItem);
    } catch (error) {
      throw error;
    }

    if (!orderItemUpdated)
      throw new BadRequestException('Không thể cập nhập giỏ hàng');

    return orderItemUpdated;
  }
}
