import { EntityRepository, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@EntityRepository(Wishlist)
export class WishlistRepository extends Repository<Wishlist> {}
