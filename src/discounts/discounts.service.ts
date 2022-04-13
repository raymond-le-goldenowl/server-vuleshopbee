import { ProductsService } from './../products/products.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountsRepository } from './discounts.repository';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(DiscountsRepository)
    private discountsRepository: DiscountsRepository,
    private productsService: ProductsService,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const { price, quantity } = createDiscountDto;

    // find product for relationship with discount table
    const product = await this.productsService.findOne(
      createDiscountDto.product_id,
    );

    // save discount
    const saved = await this.discountsRepository.save({
      price,
      quantity,
      product,
    });

    // throw error if save fail
    if (!saved) {
      throw new BadRequestException();
    }

    return saved;
  }

  async findAll(with_deleted: boolean): Promise<Discount[]> {
    let discounts: Discount[];

    if (with_deleted) {
      discounts = await this.discountsRepository.find({
        withDeleted: true,
      });
    } else {
      discounts = await this.discountsRepository.find({});
    }

    if (!discounts) {
      throw new NotFoundException();
    }

    return discounts;
  }

  async findOne(id: string, with_deleted: boolean): Promise<Discount> {
    let discount: Discount;

    if (with_deleted) {
      discount = await this.discountsRepository.findOne({
        withDeleted: true,
        where: { id },
      });
    } else {
      discount = await this.discountsRepository.findOne(id);
    }

    if (!discount) {
      throw new NotFoundException();
    }

    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    const product = await this.productsService.findOne(
      updateDiscountDto.product_id,
    );
    const discount = await this.findOne(id, true);

    discount.price = updateDiscountDto.price;
    discount.quantity = updateDiscountDto.quantity;
    discount.product = product;

    const saved = await this.discountsRepository.save(discount);

    if (!saved) {
      throw new BadRequestException();
    }

    return saved;
  }

  async remove(id: string, remove: boolean) {
    const discount = await this.findOne(id, true);

    if (remove) {
      await this.discountsRepository.delete(discount.id);
    } else {
      await this.discountsRepository.softDelete(discount.id);
    }
  }
}
