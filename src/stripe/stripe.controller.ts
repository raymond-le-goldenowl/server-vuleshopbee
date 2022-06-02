import { Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetCurrentUserDecorator } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { StripeService } from './stripe.service';

@Controller('v1/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-payment-intent/:orderId')
  async createPaymentIntent(
    @GetCurrentUserDecorator() user: User,
    @Param('orderId') orderId: string,
  ) {
    return await this.stripeService.checkoutSessions(user, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/retrieve-payment-intent/:cs')
  async retrievePaymentIntent(
    @GetCurrentUserDecorator() user: User,
    @Param('cs') cs: string,
    @Query('orderId') orderId: string,
  ) {
    return await this.stripeService.retrievePaymentIntent(cs, orderId, user);
  }
}
