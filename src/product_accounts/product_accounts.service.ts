import { Injectable } from '@nestjs/common';
import { CreateProductAccountDto } from './dto/create-product_account.dto';
import { UpdateProductAccountDto } from './dto/update-product_account.dto';

@Injectable()
export class ProductAccountsService {
  create(createProductAccountDto: CreateProductAccountDto) {
    return 'This action adds a new productAccount';
  }

  findAll() {
    return `This action returns all productAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productAccount`;
  }

  update(id: number, updateProductAccountDto: UpdateProductAccountDto) {
    return `This action updates a #${id} productAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} productAccount`;
  }
}
