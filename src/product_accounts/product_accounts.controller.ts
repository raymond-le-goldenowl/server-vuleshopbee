import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductAccountsService } from './product_accounts.service';
import { CreateProductAccountDto } from './dto/create-product_account.dto';
import { UpdateProductAccountDto } from './dto/update-product_account.dto';

@Controller('product-accounts')
export class ProductAccountsController {
  constructor(
    private readonly productAccountsService: ProductAccountsService,
  ) {}

  @Post()
  create(@Body() createProductAccountDto: CreateProductAccountDto) {
    return this.productAccountsService.create(createProductAccountDto);
  }

  @Get()
  findAll() {
    return this.productAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductAccountDto: UpdateProductAccountDto,
  ) {
    return this.productAccountsService.update(+id, updateProductAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAccountsService.remove(+id);
  }
}
