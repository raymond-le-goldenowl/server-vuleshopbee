import { EntityRepository, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@EntityRepository(Cart)
export class CartsRepository extends Repository<Cart> {}
