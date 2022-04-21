import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { Floating } from './entities/floating.entity';
import { FloatingRepository } from './floating.repository';
import { CreateFloatingDto } from './dto/create-floating.dto';
import { UpdateFloatingDto } from './dto/update-floating.dto';

@Injectable()
export class FloatingService {
  constructor(
    @InjectRepository(FloatingRepository)
    private floatingRepository: FloatingRepository,
  ) {}

  async create(icon, createFloatingDto: CreateFloatingDto): Promise<Floating> {
    // return icon;
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    createFloatingDto.text = 'search';

    if (isURL(createFloatingDto.href)) {
      createFloatingDto.text = 'url';
    }

    // create path point to images resource
    const path = `/banners/images/${icon?.filename}`;
    createFloatingDto.icon = path;

    // save and assign a result saved
    const saved = await this.floatingRepository.save(createFloatingDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save object`);
    }

    return saved;
  }

  async findAll(): Promise<Floating[]> {
    const banners = await this.floatingRepository.find({ withDeleted: true });
    return banners;
  }

  async findOneBanner(id: string): Promise<Floating> {
    // find one banner by id and with deleted
    const banner = await this.floatingRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    // throw error if deleted fail
    if (!banner) {
      throw new NotFoundException(`Banner with id "${id}" not found`);
    }

    return banner;
  }

  async update(
    icon,
    id: string,
    updateFloatingDto: UpdateFloatingDto,
  ): Promise<Floating> {
    // get banner want to update
    const banner = await this.findOneBanner(id);

    // check path
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    // create path point to images resource
    const path = `/banners/images/${icon?.filename}`;

    // replace data with new values
    banner.icon = path;
    banner.href = updateFloatingDto.href;

    banner.text = 'search';
    if (isURL(banner.href)) {
      banner.text = 'url';
    }

    banner.deleted_at = null;

    // update with new values
    const bannerUpdated = await this.floatingRepository.save(banner);

    return bannerUpdated;
  }

  async delete(id: string, remove: boolean) {
    // set `DATETIME` for delete column
    let bannerDeleted;
    if (remove) {
      bannerDeleted = await this.floatingRepository.delete(id);
    } else {
      const banner = await this.findOneBanner(id);

      // Check if banner deleted
      if (banner.deleted_at)
        throw new ConflictException(`Banner deleted before`);

      bannerDeleted = await this.floatingRepository.softDelete(id);
    }

    // throw error if deleted fail
    if (bannerDeleted.affected < 0) {
      throw new BadRequestException(`Can not delete banner with id "${id}"`);
    }

    return {
      status: true,
      message: 'Delete successfully',
    };
  }

  async deleteAll() {
    const deletedAll = await this.floatingRepository.delete({});

    if (deletedAll.affected < 0) {
      throw new BadRequestException(`Can not delete`);
    }

    return deletedAll;
  }
}
