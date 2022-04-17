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
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    createBannerDto.text = 'search';

    if (isURL(createBannerDto.href)) {
      createBannerDto.text = 'url';
    }

    // create path point to images resource
    createBannerDto.icon = `/banners/images/${icon?.filename}`;

    // save and assign a result saved
    const saved = await this.bannersRepository.save(createBannerDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save banner`);
    }

    return saved;
  }

  async findAll(withDeleted: boolean): Promise<Banner[]> {
    let banners = [];
    if (withDeleted) {
      banners = await this.bannersRepository.find({ withDeleted: true });
    } else {
      banners = await this.bannersRepository.find();
    }
    return banners;
  }

  async findOneBanner(id: string, withDeleted: boolean): Promise<Banner> {
    let banner;
    if (withDeleted) {
      banner = await this.bannersRepository.findOne({
        where: {
          id,
        },
        withDeleted: true,
      });
    } else {
      banner = await this.bannersRepository.findOne({
        where: {
          id,
        },
      });
    }

    // throw error if banner not found
    if (!banner) {
      throw new NotFoundException(`Banner with id #${id} not found`);
    }

    return banner;
  }

  async update(
    icon,
    id: string,
    updateBannerDto: UpdateBannerDto,
  ): Promise<Banner> {
    // get banner want to update
    const banner = await this.findOneBanner(id, true);

    // check path
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    // replace data with new values
    banner.icon = `/banners/images/${icon?.filename}`;
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
    const banner = await this.findOneBanner(id, true);
    if (remove) {
      await this.bannersRepository.delete(banner.id);
    } else {
      // Check if banner deleted
      if (banner.deleted_at) {
        throw new ConflictException(`Banner deleted before`);
      }

      await this.bannersRepository.softDelete(banner.id);
    }
  }

  async deleteAll() {
    await this.bannersRepository.delete({});
  }
}
