import { Product } from 'src/products/entities/product.entity';
import { Tag } from 'src/tags/entities/tag.entity';

export class CreateProductTagDto {
  product: Product;
  tag: Tag;
}
