import { Injectable } from '@nestjs/common';
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

  async checkoutSessions(user: User) {
    const checkoutSessions = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: user.cart.cartItem.map((item) => ({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price,
        },
        quantity: Number(item.quantity),
      })),

      customer: user.stripeCustomerId,

      success_url: `${process.env.FRONTEND_URL}/checkout/success-checkout`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/canel-checkout`,
    });

    return { checkoutSessions };
  }
}
