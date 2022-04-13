import { EntityRepository, Repository } from 'typeorm';

import { Discount } from './entities/discount.entity';

@EntityRepository(Discount)
export class DiscountsRepository extends Repository<Discount> {}
