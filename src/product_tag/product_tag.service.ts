import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { CreateProductTagDto } from './dto/create-product_tag.dto';
import { UpdateProductTagDto } from './dto/update-product_tag.dto';
import { ProductTagRepository } from './product_tag.repository';

@Injectable()
export class ProductTagService {
  constructor(
    @InjectRepository(ProductTagRepository)
    public productTagRepository: ProductTagRepository,
    private productsService: ProductsService,
  ) {}

  async findProductTagsByProduct(productId: string) {
    const product = await (
      await this.productsService.findOne(productId)
    ).product;

    return await this.productTagRepository.find({
      where: {
        product,
      },
    });
  }
  async create(createProductTagDto: CreateProductTagDto) {
    const saved = await this.productTagRepository.save(createProductTagDto);
    return saved;
  }

  findAll() {
    return `This action returns all productTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productTag`;
  }

  update(id: number, updateProductTagDto: UpdateProductTagDto) {
    return `This action updates a #${id} productTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} productTag`;
  }
}
