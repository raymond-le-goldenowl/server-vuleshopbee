import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductTagDto } from './dto/create-product_tag.dto';

import { ProductTagRepository } from './product_tag.repository';

import { ProductsService } from 'src/models/products/products.service';

@Injectable()
export class ProductTagService {
  constructor(
    @InjectRepository(ProductTagRepository)
    public productTagRepository: ProductTagRepository,
    private productsService: ProductsService,
  ) {}

  async findProductTagsByProduct(productId: string) {
    const { product, productsByVariantId } = await this.productsService.findOne(
      productId,
    );

    return {
      product,
      productsByVariantId,
      tags: await this.productTagRepository.find({
        where: {
          product,
        },
      }),
    };
  }
  async create(createProductTagDto: CreateProductTagDto) {
    return await this.productTagRepository.save(createProductTagDto);
  }
}
