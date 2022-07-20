import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Cart } from 'src/models/carts/entities/cart.entity';
import { Role } from 'src/models/roles/entities/role.entity';
import { Order } from 'src/models/orders/entities/order.entity';
import { Gender } from 'src/models/genders/entities/gender.entity';
import { Address } from 'src/models/address/entities/address.entity';
import { Wishlist } from 'src/models/wishlist/entities/wishlist.entity';
import { Promotion } from 'src/models/promotion/entities/promotion.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public stripeCustomerId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  citizen_identity: string;

  @Column({ type: 'boolean', default: true })
  public: boolean;

  @Column({ type: 'varchar', length: 45, default: 'default' })
  auth_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_google_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_facebook_id: string;

  @Column({ type: 'boolean', default: true })
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

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn()
  role: Role;

  @OneToMany(() => Address, (adress) => adress.user)
  address: Address[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  @OneToMany(() => Promotion, (promotion) => promotion.user)
  promotion: Promotion[];

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
