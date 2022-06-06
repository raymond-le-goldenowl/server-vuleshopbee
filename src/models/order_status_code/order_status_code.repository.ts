import { EntityRepository, Repository } from 'typeorm';
import { OrderStatusCode } from './entities/order_status_code.entity';

@EntityRepository(OrderStatusCode)
export class OrderStatusCodeRepository extends Repository<OrderStatusCode> {}
