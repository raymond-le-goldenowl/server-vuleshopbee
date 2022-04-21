import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsService } from 'src/carts/carts.service';
import { Cart } from 'src/carts/entities/cart.entity';
import { CartItemService } from 'src/cart_item/cart_item.service';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderItemService } from './../order_item/order_item.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
    private cartItemService: CartItemService,
    private cartsService: CartsService,
    private orderItemService: OrderItemService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    let orderFound: Order;

    try {
      const cart: Cart = user.cart;
      const cartItem: CartItem[] = cart.cartItem;

      let total = 0;
      cartItem.forEach((item) => {
        total += item.quantity;
      });

      const order = this.ordersRepository.create({
        ...createOrderDto,
        total,
        user,
      });

      // return order and list of order item
      const orderSaved = await this.ordersRepository.save(order);
      if (!orderSaved) throw new BadRequestException();
      await this.orderItemService.createOrderItem(order, cartItem);
      orderFound = await this.findOne(orderSaved.id, true);

      if (!orderFound) throw new NotFoundException();
      await this.cartItemService.removeCartItemByCartId(cart.id);
      await this.cartsService.resetCart(cart.id);
    } catch (error) {
      throw error;
    }

    return orderFound;
  }

  async findAll(query, user: User) {
    // create builder.
    const builder = await this.ordersRepository.createQueryBuilder('order');

    builder.leftJoin('order.user', 'user').andWhere('order.userId = :userId', {
      userId: user.id,
    });
    /** SORTING
     * sort=date-desc: Mới cập nhập.
     * sort=date-asc: cập nhập cũ nhất.
     */
    if (query?.sort && query?.sort === 'date-desc') {
      builder
        .orderBy('order.created_at', 'DESC')
        .addOrderBy('order.updated_at', 'DESC');
    } else if (query?.sort && query?.sort === 'date-asc') {
      builder
        .orderBy('order.created_at', 'ASC')
        .addOrderBy('order.updated_at', 'ASC');
    }

    // pagination
    const page = parseInt(query?.page) || 1;
    const perPage = parseInt(query?.per_page) || 8;
    //* OFFSET may not work as you may expect if you are using complex queries with joins or subqueries.
    //* If you are using pagination, it's recommended to use *skip* instead.
    // builder.offset((page - 1) * perPage).limit(perPage);
    builder.skip((page - 1) * perPage).take(perPage);

    // return data
    return await builder.getMany();
  }

  async findOne(id: string, withDelete: boolean) {
    let found: Order;
    try {
      if (withDelete) {
        found = await this.ordersRepository.findOne({
          relations: ['orderItems'],
          where: { id },
          withDeleted: true,
        });
      } else {
        found = await this.ordersRepository.findOne({
          relations: ['orderItems'],
          where: { id },
        });
      }
      if (!found) {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
    return found;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    let orderUpdated: Order;
    try {
      let order = await this.findOne(id, false);
      order = { ...order, ...updateOrderDto };
      orderUpdated = await this.ordersRepository.save(order);
    } catch (error) {
      throw error;
    }

    return orderUpdated;
  }

  async remove(id: string, remove: boolean) {
    try {
      const order = await this.findOne(id, false);
      if (remove) {
        await this.ordersRepository.delete(order);
      } else {
        await this.ordersRepository.softDelete(order);
      }
    } catch (error) {
      throw error;
    }
  }
}
