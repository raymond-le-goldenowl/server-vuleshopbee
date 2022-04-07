import { Module } from '@nestjs/common';
import { OrderStatusCodeService } from './order_status_code.service';
import { OrderStatusCodeController } from './order_status_code.controller';
import { OrderStatusCode } from './entities/order_status_code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusCode])],
  controllers: [OrderStatusCodeController],
  providers: [OrderStatusCodeService],
})
export class OrderStatusCodeModule {}
