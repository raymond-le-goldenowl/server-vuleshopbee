import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderStatusCodeDto } from './create-order_status_code.dto';

export class UpdateOrderStatusCodeDto extends PartialType(
  CreateOrderStatusCodeDto,
) {}
