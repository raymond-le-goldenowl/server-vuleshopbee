import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusCodeController } from './order_status_code.controller';
import { OrderStatusCodeRepository } from './order_status_code.repository';
import { OrderStatusCodeService } from './order_status_code.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusCodeRepository])],
  controllers: [OrderStatusCodeController],
  providers: [OrderStatusCodeService],
})
export class OrderStatusCodeModule {}
