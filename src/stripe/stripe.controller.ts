import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserDecorator } from 'src/users/decorators/get-user.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  async createPaymentIntent(@GetCurrentUserDecorator() user: User) {
    return await this.stripeService.checkoutSessions(user);
  }

  @Post('/retrieve-payment-intent/:cs')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  async retrievePaymentIntent(@Param('cs') cs: string) {
    return await this.stripeService.retrievePaymentIntent(cs);
  }
}
