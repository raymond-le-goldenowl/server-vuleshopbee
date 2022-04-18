import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Tag } from 'src/tags/entities/tag.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { GuaranteePolicy } from 'src/guarantee_policy/entities/guarantee_policy.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'integer' })
  original_price: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'char', length: 255 })
  slug: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'text' })
  tutorial: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  platform: string;

  // @Column({ type: 'boolean' })
  // available: boolean;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'integer' })
  sale_of: number;

  @Column({ type: 'uuid' })
  variant_id: string;

  @Column({ type: 'varchar', length: 255 })
  variant_title: string;

  @Column({ type: 'varchar', length: 255 })
  variant_text: string;

  @Column({ type: 'varchar', length: 255 })
  additional_information: string;

  @Column({ type: 'integer' })
  amount: number;

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

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, { eager: true })
  @JoinColumn()
  supplier: Supplier;

  @ManyToOne(() => Discount, (discount) => discount.product)
  discounts: Discount[];

  @OneToMany(() => Tag, (tag) => tag.product)
  tags: Tag[];

  @OneToOne(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist;

  @OneToOne(() => Promotion, (promotion) => promotion.product)
  promotion: Promotion;

  @OneToOne(() => CartItem, (cartItem) => cartItem.product)
  cartItem: CartItem;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.product)
  orderItem: OrderItem;

  @OneToOne(() => GuaranteePolicy, (guaranteePolicy) => guaranteePolicy.product)
  guaranteePolicy: GuaranteePolicy;
}
