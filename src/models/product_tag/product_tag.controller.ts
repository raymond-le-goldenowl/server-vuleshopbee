import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductTagService } from './product_tag.service';
import { CreateProductTagDto } from './dto/create-product_tag.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Role } from 'src/authentication/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('v1/product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createProductTagDto: CreateProductTagDto) {
    return this.productTagService.create(createProductTagDto);
  }

  @Get(':productId')
  findProductTagsByProduct(@Param('productId') productId) {
    return this.productTagService.findProductTagsByProduct(productId);
  }
}
