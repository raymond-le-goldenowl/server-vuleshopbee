import { EntityRepository, Repository } from 'typeorm';

import { ProductAccount } from './entities/product_account.entity';

@EntityRepository(ProductAccount)
export class ProductAccountsRepository extends Repository<ProductAccount> {}
