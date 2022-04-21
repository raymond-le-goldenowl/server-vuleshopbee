import { EntityRepository, Repository } from 'typeorm';
import { OrderItem } from './entities/order_item.entity';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {}
