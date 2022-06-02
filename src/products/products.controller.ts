import { FileInterceptor } from '@nestjs/platform-express';
import {
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  Controller,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { config } from './file-interceptor.config';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/users/decorators/roles.decorator';

@Controller('v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  @Post()
  create(@UploadedFile() image, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(image, createProductDto);
  }

  @Get('/filters')
  filterProducts(@Query() query) {
    return this.productsService.findAllWithSearch(query);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post('/ids')
  findAllByIds(@Body('ids') ids: string[]) {
    return this.productsService.findAllByIds(ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  @Patch(':id')
  update(
    @UploadedFile() image,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(image, id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.productsService.remove(id, remove);
  }
}
