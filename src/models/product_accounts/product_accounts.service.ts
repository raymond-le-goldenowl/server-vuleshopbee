import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductAccount } from './entities/product_account.entity';
import { OrderItem } from 'src/models/order_item/entities/order_item.entity';

import { ProductAccountsRepository } from './product_accounts.repositoty';

@Injectable()
export class ProductAccountsService {
  constructor(
    @InjectRepository(ProductAccountsRepository)
    private productAccountsRepository: ProductAccountsRepository,
  ) {}

  async getProductAccountsByProductId(
    orderItems: OrderItem[],
  ): Promise<ProductAccount[]> {
    const products = orderItems.map((item) => {
      return { product: item.product };
    });
    return await this.productAccountsRepository.find({
      relations: ['product'],
      where: products,
      withDeleted: true,
    });
  }

  async deleteProductAccountsByProductIds(productAccountIds: any[]) {
    return await this.productAccountsRepository.delete(productAccountIds);
  }
}
