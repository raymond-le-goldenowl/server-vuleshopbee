import { ProductsService } from './../products/products.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsRepository) private tagsRepository: TagsRepository,
    private productsService: ProductsService,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const product = await (
      await this.productsService.findOne(createTagDto.product_id)
    ).product;
    const saved = await this.tagsRepository.save({
      text: createTagDto.text,
      product,
    });
    return saved;
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
    const product = await (
      await this.productsService.findOne(updateTagDto.product_id)
    ).product;
    const tag = await this.tagsRepository.findOne(id);

    if (!tag) {
      throw new NotFoundException();
    }

    tag.text = updateTagDto.text;
    tag.product = product;

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
