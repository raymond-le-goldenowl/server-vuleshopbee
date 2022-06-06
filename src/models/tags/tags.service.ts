import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

import { TagsRepository } from './tags.repository';

import { ProductsService } from 'src/models/products/products.service';
import { ProductTagService } from 'src/models/product_tag/product_tag.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsRepository) private tagsRepository: TagsRepository,
    private productsService: ProductsService,
    private productTagService: ProductTagService,
    private connection: Connection,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const objectProject = await this.productsService.findOne(
        createTagDto.product_id,
      );

      const { productsByVariantId } = objectProject;

      const tag = await this.tagsRepository.findOne({
        where: {
          text: createTagDto.text,
        },
      });

      Promise.all(
        productsByVariantId.map(async (product) => {
          const productTag =
            await this.productTagService.productTagRepository.findOne({
              where: {
                tag,
                product,
              },
            });
          let saved: Tag = tag;
          if (!tag && !productTag) {
            saved = await this.tagsRepository.save({
              text: createTagDto.text,
            });
          }

          if (product && saved) {
            if (product.id === createTagDto.product_id) {
              return await this.productTagService.create({
                product: product,
                tag: saved,
              });
            } else {
              return await this.productTagService.create({
                product: product,
                tag: saved,
              });
            }
          }
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async findAll(withDeleted: boolean) {
    return await this.tagsRepository.find({ withDeleted: withDeleted });
  }

  async findOne(id: string, withDeleted: boolean) {
    const tag: Tag = await this.tagsRepository.findOne({
      where: { id },
      withDeleted: withDeleted,
    });

    if (!tag) {
      throw new NotFoundException('Không tìm thấy thẻ');
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id, true);
    tag.text = updateTagDto.text;
    return await this.tagsRepository.save(tag);
  }

  async remove(id: string, remove: boolean) {
    const tag = await this.findOne(id, true);

    if (remove) {
      return await this.tagsRepository.delete(tag.id);
    }

    return await this.tagsRepository.softDelete(tag.id);
  }
}
