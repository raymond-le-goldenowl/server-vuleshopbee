import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderStatusCode } from './entities/order_status_code.entity';
import { OrderStatusCodeRepository } from './order_status_code.repository';
import { CreateOrderStatusCodeDto } from './dto/create-order_status_code.dto';
import { UpdateOrderStatusCodeDto } from './dto/update-order_status_code.dto';

@Injectable()
export class OrderStatusCodeService {
  constructor(
    @InjectRepository(OrderStatusCodeRepository)
    private orderStatusCodeRepository: OrderStatusCodeRepository,
  ) {}

  async create(createOrderStatusCodeDto: CreateOrderStatusCodeDto) {
    let orderStatusCodeSaved: OrderStatusCode;
    try {
      const orderStatusCode = await this.orderStatusCodeRepository.create(
        createOrderStatusCodeDto,
      );

      if (!orderStatusCode)
        throw new BadRequestException(`Can't create order status code`);
      orderStatusCodeSaved = await this.orderStatusCodeRepository.save(
        orderStatusCode,
      );
    } catch (error) {
      throw error;
    }

    return orderStatusCodeSaved;
  }

  async findAll(withDeleted: boolean) {
    let listOrderStatusCode: OrderStatusCode[];
    try {
      if (withDeleted) {
        listOrderStatusCode = await this.orderStatusCodeRepository.find({
          withDeleted: true,
        });
      } else {
        listOrderStatusCode = await this.orderStatusCodeRepository.find();
      }
    } catch (error) {
      throw error;
    }

    return listOrderStatusCode;
  }

  async findOne(id: string, withDeleted: boolean) {
    let orderStatusCode: OrderStatusCode;
    try {
      if (withDeleted) {
        orderStatusCode = await this.orderStatusCodeRepository.findOne({
          withDeleted: true,
          where: { id },
        });
      } else {
        orderStatusCode = await this.orderStatusCodeRepository.findOne({
          where: { id },
        });
      }
    } catch (error) {
      throw error;
    }

    return orderStatusCode;
  }

  async update(id: string, updateOrderStatusCodeDto: UpdateOrderStatusCodeDto) {
    let orderStatusCodeSaved: OrderStatusCode;
    try {
      const orderStatusCode = await this.findOne(id, true);
      if (!orderStatusCode) throw new NotFoundException();

      orderStatusCodeSaved = await this.orderStatusCodeRepository.save(
        updateOrderStatusCodeDto,
      );
    } catch (error) {
      throw error;
    }

    return orderStatusCodeSaved;
  }

  async remove(id: string, remove: boolean) {
    try {
      const orderStatusCode = await this.findOne(id, true);
      if (!orderStatusCode) throw new NotFoundException();

      if (remove) {
        await this.orderStatusCodeRepository.delete(orderStatusCode.id);
      } else {
        await this.orderStatusCodeRepository.softDelete(orderStatusCode.id);
      }
    } catch (error) {
      throw error;
    }
  }
}
