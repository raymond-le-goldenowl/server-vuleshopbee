import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderStatusCode } from 'src/order_status_code/entities/order_status_code.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  total: number;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'char', length: 320 })
  receiver: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

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

  // @ManyToOne(
  //   () => OrderStatusCode,
  //   (orderStatusCode) => orderStatusCode.orders,
  //   {
  //     eager: true,
  //   },
  // )
  // @JoinColumn()
  // orderStatusCode: OrderStatusCode;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
