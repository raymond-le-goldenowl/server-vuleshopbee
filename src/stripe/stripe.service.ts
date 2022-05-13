import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
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
    let checkoutSessions;
    try {
      const order = user.orders.find(
        (item) => item.id === orderId && item.status === false,
      );
      if (!order) {
        throw new BadRequestException('Bạn không có phiếu thanh toán');
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
        success_url: `${process.env.FRONTEND_URL}/account/cart/success`,
        cancel_url: `${process.env.FRONTEND_URL}/account/cart/cancel`,
      });
    } catch (error) {
      throw error;
    }
    return { checkoutSessions, orderId };
  }

  async retrievePaymentIntent(clientSecret: string) {
    const session = this.stripe.checkout.sessions.retrieve(clientSecret);

    return session;
  }

  // not used.
  async retrieveListLineItems(clientSecret: string) {
    const session = this.stripe.checkout.sessions.listLineItems(clientSecret);
    return session;
  }
}
