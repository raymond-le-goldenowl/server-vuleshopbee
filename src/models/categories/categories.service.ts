import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { CategoriesRepository } from './categories.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesRepository.save(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({ withDeleted: true });
  }

  async findOne(id: string): Promise<Category> {
    const category: Category = await this.categoriesRepository.findOne({
      withDeleted: true,
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Không tìm thấy loại');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    category.text = updateCategoryDto.text;
    category.value = updateCategoryDto.value;
    category.deleted_at = null;

    return this.categoriesRepository.save(category);
  }

  async removeAll(remove: boolean): Promise<DeleteResult | any> {
    if (remove) {
      return await this.categoriesRepository.delete({});
    }
    return await this.categoriesRepository.softDelete({});
  }

  async remove(id: string, remove: boolean) {
    if (remove) {
      return await this.categoriesRepository.delete(id);
    }
    return await this.categoriesRepository.softDelete(id);
  }
}
