import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  accept_guaratee_policy: boolean;

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

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItem: CartItem[];
}
