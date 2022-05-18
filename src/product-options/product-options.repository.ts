import { EntityRepository, Repository } from 'typeorm';
import { ProductOption } from './entities/product-option.entity';

@EntityRepository(ProductOption)
export class ProductOptionsRepository extends Repository<ProductOption> {}
