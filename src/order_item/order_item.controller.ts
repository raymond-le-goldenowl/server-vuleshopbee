import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { OrderItemService } from './order_item.service';

@Controller('v1/order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.orderItemService.removeById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.updateQuantityOfItem(id, updateOrderItemDto);
  }

  @Get('/best-sellers')
  getBestSellersLimit(@Query() query) {
    return this.orderItemService.findLimitBestSellers(query);
  }
}
