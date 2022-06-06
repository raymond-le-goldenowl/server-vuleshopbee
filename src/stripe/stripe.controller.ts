import {
  BadRequestException,
  Controller,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
      case 'checkout.session.async_payment_failed':
        {
          const session = data.object;
          console.log(
            '🚀 ~ file: stripe.controller.ts ~ line 61 ~ StripeController ~ session',
            session,
          );
          // Then define and call a function to handle the event checkout.session.async_payment_failed
        }

        break;
      case 'checkout.session.async_payment_succeeded':
        {
          const session = data.object;
          console.log(
            '🚀 ~ file: stripe.controller.ts ~ line 66 ~ StripeController ~ session',
            session,
          );
          // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        }

        break;
      case 'checkout.session.completed':
        {
          const session = data.object;
          console.log(
            '🚀 ~ file: stripe.controller.ts ~ line 71 ~ StripeController ~ session',
            session,
          );
          // Then define and call a function to handle the event checkout.session.completed
        }

        break;
      case 'checkout.session.expired':
        {
          const session = data.object;
          // Then define and call a function to handle the event checkout.session.expired
        }
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
