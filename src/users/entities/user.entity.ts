import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Cart } from 'src/carts/entities/cart.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Gender } from 'src/genders/entities/gender.entity';
import { Address } from 'src/address/entities/address.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'char', length: 255 })
  username: string;

  @Column({ type: 'char', length: 255 })
  password: string;

  @Column({ type: 'char', length: 320 })
  email: string;

  @Column({ type: 'text' })
  avatar: string;

  @Column({ type: 'char', length: 15 })
  citizen_identity: string;

  @Column({ type: 'boolean' })
  public: boolean;

  @Column({ type: 'varchar', length: 45 })
  auth_type: string;

  @Column({ type: 'char', length: 255 })
  user_google_id: string;

  @Column({ type: 'char', length: 255 })
  user_facebook_id: string;

  @Column({ type: 'boolean' })
  is_active: boolean;

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

  @OneToOne(() => Gender, (gender) => gender.user)
  @JoinColumn()
  gender: Gender;

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

  @OneToMany(() => Address, (adress) => adress.user)
  address: Address[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  @OneToMany(() => Promotion, (promotion) => promotion.user)
  promotion: Promotion[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
