import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductTagService } from './product_tag.service';
import { CreateProductTagDto } from './dto/create-product_tag.dto';
import { UpdateProductTagDto } from './dto/update-product_tag.dto';

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

  @Get()
  findAll() {
    return this.productTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTagService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductTagDto: UpdateProductTagDto,
  ) {
    return this.productTagService.update(+id, updateProductTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTagService.remove(+id);
  }
}
