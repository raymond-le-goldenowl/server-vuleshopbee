import { Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetCurrentUserDecorator } from 'src/users/decorators/get-user.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/create-payment-intent/:orderId')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  async createPaymentIntent(
    @GetCurrentUserDecorator() user: User,
    @Param('orderId') orderId: string,
  ) {
    return await this.stripeService.checkoutSessions(user, orderId);
  }

  @Post('/retrieve-payment-intent/:cs')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  async retrievePaymentIntent(
    @GetCurrentUserDecorator() user: User,
    @Param('cs') cs: string,
    @Query('orderId') orderId: string,
  ) {
    return await this.stripeService.retrievePaymentIntent(cs, orderId, user);
  }
}
