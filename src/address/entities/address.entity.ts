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
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { District } from 'src/districts/entities/district.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  street: string;

  @Column({ type: 'boolean' })
  primary: boolean;

  @Column({ type: 'char', length: 15 })
  phone: string;

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

  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn()
  user: User;

  @OneToOne(() => Province, (province) => province.address)
  @JoinColumn()
  province: Province;

  @OneToOne(() => District, (district) => district.address)
  @JoinColumn()
  district: District;

  @OneToOne(() => Ward, (ward) => ward.address)
  @JoinColumn()
  ward: Ward;
}
