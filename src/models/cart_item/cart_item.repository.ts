import { EntityRepository, Repository } from 'typeorm';
import { CartItem } from './entities/cart_item.entity';

@EntityRepository(CartItem)
export class CartItemRepository extends Repository<CartItem> {}
