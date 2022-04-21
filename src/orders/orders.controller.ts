import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/users/decorators/roles.decorator';
import { GetCurrentUserDecorator } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUserDecorator() user: User,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get()
  findAll(@Query() query, @GetCurrentUserDecorator() user: User) {
    return this.ordersService.findAll(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.ordersService.findOne(id, withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.ordersService.remove(id, remove);
  }
}
