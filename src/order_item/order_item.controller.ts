import { Controller, Delete, Param } from '@nestjs/common';
import { OrderItemService } from './order_item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.orderItemService.removeById(id);
  }
}
