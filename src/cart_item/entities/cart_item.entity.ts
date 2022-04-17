import {
  Entity,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Cart } from 'src/carts/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deleted_at: Date;

  @OneToOne(() => Product, (product) => product.cartItem)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.cartItem)
  @JoinColumn()
  cart: Cart;
}
