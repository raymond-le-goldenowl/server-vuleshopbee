import { MenuRepository } from './menu.repository';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuRepository) private menuRepository: MenuRepository,
    private categoriesService: CategoriesService,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const { icon, text, category_id } = createMenuDto;

    const category = await this.categoriesService.findOne(category_id);

    const href = category.text.split(' ').join('-').toLocaleLowerCase();

    const menuSaved = await this.menuRepository.save({
      href,
      icon,
      text,
      category,
    });

    if (!menuSaved) {
      throw new BadRequestException();
    }

    return menuSaved;
  }

  async findAll() {
    let list: Menu[];
    try {
      list = await this.menuRepository.find({ withDeleted: true });
    } catch (error) {
      throw error;
    }

    return list;
  }

  async findOne(id: string) {
    let menu: Menu;
    try {
      menu = await this.menuRepository.findOne({
        withDeleted: true,
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }

    if (!menu) {
      throw new NotFoundException();
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    let menu: Menu;
    let menuUpdated: Menu;

    try {
      menu = await this.findOne(id);
      if (!menu) throw new NotFoundException();

      menu.href = updateMenuDto.href;
      menu.icon = updateMenuDto.icon;
      menu.text = updateMenuDto.text;
      menu.deleted_at = null;

      menuUpdated = await this.menuRepository.save(menu);

      if (!menuUpdated) throw new BadRequestException();
    } catch (error) {
      throw error;
    }

    return menuUpdated;
  }

  async removeAll(remove: boolean) {
    try {
      if (remove) {
        await this.menuRepository.delete({});
      } else {
        await this.menuRepository.softDelete({});
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, remove: boolean) {
    try {
      if (remove) {
        await this.menuRepository.delete(id);
      } else {
        await this.menuRepository.softDelete(id);
      }
    } catch (error) {
      throw error;
    }
  }
}
