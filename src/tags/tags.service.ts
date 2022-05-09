import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { ProductTagService } from 'src/product_tag/product_tag.service';
import { Connection } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagsRepository } from './tags.repository';

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
    let savedProductTag = null;
    try {
      const objectProject = await await this.productsService.findOne(
        createTagDto.product_id,
      );

      const { productsByVariantId } = objectProject;

      const tag = await this.tagsRepository.findOne({
        where: {
          text: createTagDto.text,
        },
      });

      productsByVariantId.forEach(async (product) => {
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
            savedProductTag = await this.productTagService.create({
              product: product,
              tag: saved,
            });
          } else {
            await this.productTagService.create({
              product: product,
              tag: saved,
            });
          }
        }
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      return savedProductTag;
    }
  }

  async findAll(withDeleted) {
    let tags = [];

    if (withDeleted) {
      tags = await this.tagsRepository.find({ withDeleted: true });
    } else {
      tags = await this.tagsRepository.find();
    }

    return tags;
  }

  async findOne(id: string, withDeleted: boolean) {
    let tag = {};
    if (withDeleted) {
      tag = await this.tagsRepository.findOne({
        where: { id },
        withDeleted: true,
      });
    } else {
      tag = await this.tagsRepository.findOne(id);
    }

    if (!tag) {
      throw new NotFoundException('Tags not found');
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagsRepository.findOne(id);

    if (!tag) {
      throw new NotFoundException();
    }

    tag.text = updateTagDto.text;

    const saved = await this.tagsRepository.save(tag);

    return saved;
  }

  async remove(id: string, remove: boolean) {
    try {
      const tag = await this.tagsRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!tag) {
        throw new NotFoundException();
      }

      if (remove) {
        await this.tagsRepository.delete(tag.id);
      } else {
        await this.tagsRepository.softDelete(tag.id);
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
