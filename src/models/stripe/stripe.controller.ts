import {
  BadRequestException,
  Controller,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserDecorator } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/models/users/entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
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

  @Post('/webhook')
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      req.body,
    );

    // Extract the object from the event
    const data = event.data;
    const eventType = event.type;

    // Handle the event
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = data.object;
        const paymentIntentId = session?.payment_intent;

        await this.stripeService.updateOrderWhenCheckoutSessionCompleted(
          paymentIntentId,
        );
        break;
      }

      default:
        break;
    }
  }
}
