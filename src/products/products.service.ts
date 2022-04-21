import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private productsRepository: ProductsRepository,
    private categoriesService: CategoriesService,
  ) {}

  async create(image: any, createProductDto: CreateProductDto) {
    const {
      name,
      model,
      original_price,
      price,
      tutorial,
      description,
      platform,
      status,
      sale_of,
      variant_id,
      variant_title,
      variant_text,
      additional_information,
      amount,
      category_id,
    } = createProductDto;

    if (!image?.filename) {
      throw new BadRequestException();
    }

    const slug = name.split(' ').join('-');
    const category = await this.categoriesService.findOne(category_id);
    const productSaved = await this.productsRepository.save({
      name,
      model,
      original_price,
      price,
      slug: slug,
      image: image?.filename,
      tutorial,
      description,
      platform,
      status,
      sale_of,
      variant_id,
      variant_title,
      variant_text,
      additional_information,
      amount,
      category,
    });

    if (!productSaved) {
      throw new BadRequestException();
    }

    return productSaved;
  }

  async findAll() {
    const products = await this.productsRepository.find({ withDeleted: true });
    return products;
  }

  async findAllWithSearch(query) {
    // create builder.
    const builder = await this.productsRepository.createQueryBuilder('product');

    // join with categories.
    if (query?.category_id) {
      const category_id = query?.category_id;
      builder
        .leftJoinAndSelect('product.category', 'category')
        .andWhere('category.id = :category_id', {
          category_id: category_id,
        });
    }

    // join with tag.
    if (query?.tag) {
      const tag = query?.tag;
      builder
        .leftJoinAndSelect('product.tags', 'tag')
        .andWhere('tag.text LIKE :tag', {
          tag: `%${tag}%`,
        });
    }

    // Filter range price
    if (query?.price_from && query?.price_to) {
      const price_from = query?.price_from;
      const price_to = query?.price_to;
      builder.andWhere('product.price BETWEEN :price_from AND :price_to', {
        price_from,
        price_to,
      });
    } else if (query?.price_from) {
      const price_from = query?.price_from;
      builder.andWhere('product.price >= :price_from', {
        price_from,
      });
    } else if (query?.price_to) {
      const price_to = query?.price_to;
      builder.andWhere('product.price <= :price_to', {
        price_to,
      });
    }

    /** SORTING
     * sort=sales-desc: bán chạy nhất
     * sort=date-desc: Mới cập nhập.
     * sort=date-asc: cập nhập cũ nhất.
     * price-asc: giá thấp đến cao.
     * price-desc: giá cao đến thấp.
     * name-asc: từ A đến Z.
     * name-desc: từ Z đến A.
     */
    if (query?.sort && query?.sort === 'date-desc') {
      builder
        .orderBy('product.created_at', 'DESC')
        .addOrderBy('product.updated_at', 'DESC');
    } else if (query?.sort && query?.sort === 'date-asc') {
      builder
        .orderBy('product.created_at', 'ASC')
        .addOrderBy('product.updated_at', 'ASC');
    } else if (query?.sort && query?.sort === 'price-asc') {
      builder.orderBy('product.price', 'ASC');
    } else if (query?.sort && query?.sort === 'price-desc') {
      builder.orderBy('product.price', 'DESC');
    } else if (query?.sort && query?.sort === 'name-asc') {
      builder.orderBy('product.name', 'ASC');
    } else if (query?.sort && query?.sort === 'name-desc') {
      builder.orderBy('product.name', 'DESC');
    }

    // pagination
    const page = parseInt(query?.page) || 1;
    const perPage = parseInt(query?.per_page) || 8;
    //* OFFSET may not work as you may expect if you are using complex queries with joins or subqueries.
    //* If you are using pagination, it's recommended to use *skip* instead.
    // builder.offset((page - 1) * perPage).limit(perPage);
    builder.skip((page - 1) * perPage).take(perPage);

    // return data
    return await builder.getMany();
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne(id);
    return product;
  }

  async update(image, id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const categoryId = updateProductDto.category_id;
    const category = await this.categoriesService.findOne(categoryId);

    if (!category) {
      throw new NotFoundException();
    }

    if (!image?.filename) {
      throw new BadRequestException();
    }

    product.name = updateProductDto.name;
    product.model = updateProductDto.model;
    product.original_price = updateProductDto.original_price;
    product.price = updateProductDto.price;
    product.image = image?.filename;
    product.tutorial = updateProductDto.tutorial;
    product.description = updateProductDto.description;
    product.platform = updateProductDto.platform;
    product.status = updateProductDto.status;
    product.sale_of = updateProductDto.sale_of;
    product.variant_id = updateProductDto.variant_id;
    product.variant_title = updateProductDto.variant_title;
    product.variant_text = updateProductDto.variant_text;
    product.additional_information = updateProductDto.additional_information;
    product.amount = updateProductDto.amount;
    product.category = category;

    const productSaved = await this.productsRepository.save(product);

    return productSaved;
  }

  async remove(id: string, remove: boolean) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException();
    }

    if (remove) {
      await this.productsRepository.delete(product);
    } else {
      await this.productsRepository.softDelete(product);
    }
  }
}
