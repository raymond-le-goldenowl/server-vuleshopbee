import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Cart } from 'src/carts/entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { OrdersRepository } from './orders.repository';

import { CartsService } from 'src/carts/carts.service';
import { CartItemService } from 'src/cart_item/cart_item.service';
import { EmailService } from 'src/email/email.service';
import { OrderItemService } from './../order_item/order_item.service';
import { ProductAccountsService } from 'src/product_accounts/product_accounts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
    private cartItemService: CartItemService,
    private cartsService: CartsService,
    private orderItemService: OrderItemService,
    private connection: Connection,
    private emailService: EmailService,
    private productAccountsService: ProductAccountsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    let orderFound: Order;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart: Cart = user.cart;
      const allCartItemsWithCartId = await this.cartItemService.findAll(
        true,
        cart.id,
      );

      // find product with quantity of product is zero
      const someQuantityGreaterThanProductAmount = allCartItemsWithCartId.find(
        (item) => {
          return item.quantity > item.product.amount;
        },
      );

      if (someQuantityGreaterThanProductAmount) {
        throw new BadRequestException(
          `Sản phẩm ${someQuantityGreaterThanProductAmount.product.name} chỉ còn ${someQuantityGreaterThanProductAmount.product.amount}. Vui lòng thay đổi số lượng để phù hợp hơn`,
        );
      }

      // find product with quantity of product is zero
      const someQuantityEqualZero = allCartItemsWithCartId.find(
        ({ product }) => {
          return product?.amount === 0;
        },
      );

      // if quantity equal zero, we will return an error with custom message
      if (someQuantityEqualZero) {
        throw new BadRequestException(
          `Sản phẩm ${someQuantityEqualZero.product.name} đã hết hàng, vui lòng xóa sản phẩm khỏi giỏ hàng`,
        );
      }

      // check if cart item with quantity == 0 will not create order with that item.
      const cartItem: CartItem[] = allCartItemsWithCartId.filter(
        (item: CartItem) => item.quantity !== 0,
      );

      const total = cartItem.reduce((pre, curr) => pre + curr.quantity, 0);
      const amount = cartItem.reduce(
        (pre, curr) => pre + curr.product.price * curr.quantity,
        0,
      );
      // return order and list of order item
      const orderSaved = await this.ordersRepository.save({
        ...createOrderDto,
        total,
        amount,
        user,
      });

      if (!orderSaved) throw new BadRequestException('Không thể  tạo đơn hàng');
      await this.orderItemService.createOrderItem(orderSaved, cartItem);
      orderFound = await this.findOne(orderSaved.id, true);
      if (!orderFound) throw new NotFoundException('Không tìm thấy đơn hàng');
      // remove cart after saved
      await this.cartItemService.removeCartItemByCartId(cart.id);
      await this.cartsService.resetCart(cart.id);

      // run query.
      await queryRunner.commitTransaction();
    } catch (error) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    return orderFound;
  }

  async findAll(user: User) {
    // create builder.
    const orders = await this.ordersRepository.find({
      where: {
        user,
      },
      withDeleted: true,
    });

    return orders;
  }

  async filter(query, user: User) {
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
          relations: ['orderItems', 'orderItems.product'],
          where: { id },
          withDeleted: true,
        });
      } else {
        found = await this.ordersRepository.findOne({
          relations: ['orderItems', 'orderItems.product'],
          where: { id },
        });
      }
      if (!found) {
        throw new NotFoundException('Không tìm thấy đơn hàng');
      }
    } catch (error) {
      throw error;
    }
    return found;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: User) {
    //   !
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let orderUpdated: Order;
    try {
      // cập nhập số lượng hàng.
      const order = await this.findOne(id, false);
      const orderItems = await this.orderItemService.getAllByOrder(order);
      order.status = updateOrderDto.status;
      orderUpdated = await this.ordersRepository.save(order);

      if (!orderUpdated) {
        throw new BadRequestException('Không thể cập nhập đơn hàng');
      }
      await this.orderItemService.updateManyProductWithEachOrderItem(
        orderItems,
      );
      // send mail here.
      const arrayData = [];
      const productAccountIds = [];

      // get account to send to customer
      const productAccounts =
        await this.productAccountsService.getProductAccountsByProductId(
          orderItems,
        );

      // create list to send to customer
      orderItems.forEach(async (oi) => {
        if (productAccounts.length === 0) return null;
        productAccounts.forEach((pa, index) => {
          if (index >= oi.quantity) return null;
          const dt = {
            productName: oi?.product?.name,
            productUsername: pa?.username,
            productPassword: pa?.password,
          };
          productAccountIds.push(pa.id);
          arrayData.push(dt);
        });
      });

      const message = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'AMP4EMAIL message',
        text: 'For clients with plaintext support only',
        html: this.emailService.emailTemplate(
          'bạn vừa nhận được dữ liệu từ tôi',
          arrayData,
        ),
        amp: `<!doctype html>
          <html ⚡4email>
            <head>
              <meta charset="utf-8">
              <style amp4email-boilerplate>body{visibility:hidden}</style>
              <script async src="https://cdn.ampproject.org/v0.js"></script>
              <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
            </head>
            <body>
              <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
              <p>GIF (requires "amp-anim" script in header):<br/>
                <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
            </body>
          </html>`,
      };

      const sended4current = await this.emailService.sendMail(message);
      if (sended4current) {
        message.to = order.receiver;
        await this.emailService.sendMail(message);
        await this.productAccountsService.deleteProductAccountsByProductIds(
          productAccountIds,
        );
      }

      // run query.
      await queryRunner.commitTransaction();
    } catch (error) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async remove(id: string, remove: boolean) {
    let deleted: any;
    try {
      const order = await this.findOne(id, true);

      await this.orderItemService.removeMany(order.orderItems);

      if (remove) {
        deleted = await this.ordersRepository.delete(order.id);
      } else {
        deleted = await this.ordersRepository.softDelete(order.id);
      }
    } catch (error) {
      throw error;
    }
    return deleted?.affected > 0;
  }

  async updateBeforeCheckout(
    quantity,
    orderItemId,
    orderId,
    productId,
    user: User,
  ) {
    let orderSaved;
    try {
      const orderItem = await this.orderItemService.updateQuantityOfItem(
        orderItemId,
        {
          quantity,
          orderId,
          productId,
        },
      );

      if (orderItem) {
        const order = await this.findOne(orderId, false);
        const orderItems = order.orderItems;

        // // find product with quantity of product is zero
        // const someQuantityEqualZero = orderItems.find(({ product }) => {
        //   return product?.amount === 0;
        // });

        // // if quantity equal zero, we will return an error with custom message
        // if (someQuantityEqualZero) {
        //   throw new BadRequestException(
        //     `Sản phẩm ${someQuantityEqualZero.product.name} đã hết hàng, vui lòng xóa sản phẩm khỏi đơn hàng`,
        //   );
        // }

        const total = orderItems.reduce((pre, curr) => pre + curr.quantity, 0);
        const amount = orderItems.reduce(
          (pre, curr) => pre + curr.product.price * curr.quantity,
          0,
        );

        // return order and list of order item
        orderSaved = await this.ordersRepository.save({
          id: order.id,
          total,
          amount,
          description: order.description,
          receiver: order.receiver,
          status: order.status,
          user,
        });
      } else {
        throw new BadRequestException('Chưa cập nhập được giỏ hàng');
      }
    } catch (error) {
      throw error;
    }
    return orderSaved;
  }
}
