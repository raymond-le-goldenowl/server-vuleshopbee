import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { Banner } from './entities/banner.entity';
import { BannersRepository } from './banners.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannersRepository)
    private bannersRepository: BannersRepository,
  ) {}

  async create(icon, createBannerDto: CreateBannerDto): Promise<Banner> {
    // return icon;
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    createBannerDto.text = 'search';

    if (isURL(createBannerDto.href)) {
      createBannerDto.text = 'url';
    }

    // create path point to images resource
    const path = `/banners/images/${icon?.filename}`;
    createBannerDto.icon = path;

    // save and assign a result saved
    const saved = await this.bannersRepository.save(createBannerDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save object`);
    }

    return saved;
  }

  async findAll(): Promise<Banner[]> {
    const banners = await this.bannersRepository.find({ withDeleted: true });
    return banners;
  }

  async findOneBanner(id: string): Promise<Banner> {
    // find one banner by id and with deleted
    const banner = await this.bannersRepository.findOne({
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
    updateBannerDto: UpdateBannerDto,
  ): Promise<Banner> {
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
    banner.href = updateBannerDto.href;

    banner.text = 'search';
    if (isURL(banner.href)) {
      banner.text = 'url';
    }

    banner.deleted_at = null;

    // update with new values
    const bannerUpdated = await this.bannersRepository.save(banner);

    return bannerUpdated;
  }

  async delete(id: string, remove: boolean) {
    // set `DATETIME` for delete column
    let bannerDeleted;
    if (remove) {
      bannerDeleted = await this.bannersRepository.delete(id);
    } else {
      const banner = await this.findOneBanner(id);

      // Check if banner deleted
      if (banner.deleted_at) {
        throw new ConflictException(`Banner deleted before`);
      }

      bannerDeleted = await this.bannersRepository.softDelete(id);
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
    const deletedAll = await this.bannersRepository.delete({});

    if (deletedAll.affected < 0) {
      throw new BadRequestException(`Can not delete`);
    }

    return deletedAll;
  }
}
