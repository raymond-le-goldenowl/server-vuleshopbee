import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemController } from './order_item.controller';
import { OrderItemRepository } from './order_item.repository';
import { OrderItemService } from './order_item.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemRepository])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
