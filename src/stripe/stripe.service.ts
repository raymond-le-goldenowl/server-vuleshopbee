import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { User } from 'src/users/entities/user.entity';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async checkoutSessions(user: User, orderId: string) {
    let checkoutSessions: any;
    try {
      const order = await this.ordersService.findOne(orderId, false);

      // checkout is any product not enough quantity for checkout.
      const issueItems = order.orderItems.filter(
        (item) => item.quantity > item.product.amount,
      );

      if (issueItems.length > 0) {
        // return error.
        return {
          message:
            'Không thể thanh toán, vui lòng kiểm tra lại số lượng sản phẩm trong giỏ hàng của bạn',
          statusCode: 400,
          errorCode: '#400550',
          issueItems,
        };
      }

      const items = order.orderItems.map((item) => {
        if (item.quantity === 0) return;
        return {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: item.product_name,
            },
            unit_amount: item.product_price,
          },
          quantity: Number(item.quantity),
        };
      });

      checkoutSessions = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: items,
        customer: user.stripeCustomerId,
        success_url: `${process.env.FRONTEND_URL}/account/stripe/success`,
        cancel_url: `${process.env.FRONTEND_URL}/account/stripe/cancel`,
      });
    } catch (error) {
      throw error;
    }

    return { checkoutSessions, orderId };
  }

  async retrievePaymentIntent(
    clientSecret: string,
    orderId: string,
    user: User,
  ) {
    const session = this.stripe.checkout.sessions.retrieve(clientSecret);

    if (session) {
      this.ordersService.update(orderId, { status: true }, user);
    }

    return session;
  }
}
