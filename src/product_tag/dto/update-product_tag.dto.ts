import { PartialType } from '@nestjs/swagger';
import { CreateProductTagDto } from './create-product_tag.dto';

export class UpdateProductTagDto extends PartialType(CreateProductTagDto) {}
