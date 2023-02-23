import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductAccount } from './entities/product_account.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';

import { ProductAccountsRepository } from './product_accounts.repositoty';

import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ProductAccountsService {
  constructor(
    @InjectRepository(ProductAccountsRepository)
    private productAccountsRepository: ProductAccountsRepository,
    private productsService: ProductsService,
  ) {}

  async getProductAccountsByProductId(
    orderItems: OrderItem[],
  ): Promise<ProductAccount[]> {
    let productAccounts;
    try {
      const products = orderItems.map((item) => {
        return { product: item.product };
      });
      productAccounts = await this.productAccountsRepository.find({
        relations: ['product'],
        where: products,
        withDeleted: true,
      });
    } catch (error) {
      throw error;
    }

    return productAccounts;
  }

  async deleteProductAccountsByProductIds(productAccountIds: any[]) {
    try {
      await this.productAccountsRepository.delete(productAccountIds);
    } catch (error) {
      throw error;
    }
  }
}
