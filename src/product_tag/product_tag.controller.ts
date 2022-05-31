import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductTagService } from './product_tag.service';
import { CreateProductTagDto } from './dto/create-product_tag.dto';

@Controller('v1/product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Post()
  create(@Body() createProductTagDto: CreateProductTagDto) {
    return this.productTagService.create(createProductTagDto);
  }

  @Get(':productId')
  findProductTagsByProduct(@Param('productId') productId) {
    return this.productTagService.findProductTagsByProduct(productId);
  }
}
