import { Promotion } from './entities/promotion.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Promotion)
export class PromotionRepository extends Repository<Promotion> {}
