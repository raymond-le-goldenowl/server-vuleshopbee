import { Injectable } from '@nestjs/common';
import { CreateOrderStatusCodeDto } from './dto/create-order_status_code.dto';
import { UpdateOrderStatusCodeDto } from './dto/update-order_status_code.dto';

@Injectable()
export class OrderStatusCodeService {
  create(createOrderStatusCodeDto: CreateOrderStatusCodeDto) {
    return 'This action adds a new orderStatusCode';
  }

  findAll() {
    return `This action returns all orderStatusCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderStatusCode`;
  }

  update(id: number, updateOrderStatusCodeDto: UpdateOrderStatusCodeDto) {
    return `This action updates a #${id} orderStatusCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderStatusCode`;
  }
}
