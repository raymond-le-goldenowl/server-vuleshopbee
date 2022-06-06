import { Discount } from './entities/discount.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Discount)
export class DiscountsRepository extends Repository<Discount> {}
