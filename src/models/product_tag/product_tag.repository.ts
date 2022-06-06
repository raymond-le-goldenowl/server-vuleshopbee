import { EntityRepository, Repository } from 'typeorm';

import { ProductTag } from './entities/product_tag.entity';

@EntityRepository(ProductTag)
export class ProductTagRepository extends Repository<ProductTag> {}
