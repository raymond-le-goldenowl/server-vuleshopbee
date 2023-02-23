import { Product } from 'src/models/products/entities/product.entity';
import { Tag } from 'src/models/tags/entities/tag.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
@Entity()
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.productTags, {
    nullable: true,
  })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Tag, (tag) => tag.productTags, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  tag: Tag;

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
}
