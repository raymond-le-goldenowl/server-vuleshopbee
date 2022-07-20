import { Product } from 'src/models/products/entities/product.entity';
import { Tag } from 'src/models/tags/entities/tag.entity';

export class CreateProductTagDto {
  product: Product;
  tag: Tag;
}
