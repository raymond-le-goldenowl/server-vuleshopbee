import { EntityRepository, Repository } from 'typeorm';

import { Product } from 'src/products/entities/product.entity';

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {}
