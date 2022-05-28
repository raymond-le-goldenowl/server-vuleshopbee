import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isURL } from 'class-validator';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './entities/slide.entity';
import { SlidesRepository } from './slides.repository';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(SlidesRepository)
    private slidesRepository: SlidesRepository,
  ) {}

  async create(icon, createSlideDto: CreateSlideDto): Promise<Slide> {
    // return icon;
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    createSlideDto.text = 'search';

    if (isURL(createSlideDto.href)) {
      createSlideDto.text = 'url';
    }

    // create path point to images resource
    const path = `/Slides/images/${icon?.filename}`;
    createSlideDto.icon = path;

    // save and assign a result saved
    const saved = await this.slidesRepository.save(createSlideDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save object`);
    }

    return saved;
  }

  async findAll(): Promise<Slide[]> {
    const slides = await this.slidesRepository.find({ withDeleted: true });
    return slides;
  }

  async findOneSlide(id: string): Promise<Slide> {
    // find one Slide by id and with deleted
    const slide = await this.slidesRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    // throw error if deleted fail
    if (!slide) {
      throw new NotFoundException(`Slide with id "${id}" not found`);
    }

    return slide;
  }

  async update(
    icon,
    id: string,
    updateSlideDto: UpdateSlideDto,
  ): Promise<Slide> {
    // get Slide want to update
    const slide = await this.findOneSlide(id);

    // check path
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    // create path point to images resource
    const path = `/Slides/images/${icon?.filename}`;

    // replace data with new values
    slide.icon = path;
    slide.href = updateSlideDto.href;

    slide.text = 'search';
    if (isURL(slide.href)) {
      slide.text = 'url';
    }

    slide.deleted_at = null;

    // update with new values
    const slideUpdated = await this.slidesRepository.save(slide);

    return slideUpdated;
  }

  async delete(id: string, remove: boolean) {
    // set `DATETIME` for delete column
    let slideDeleted;
    if (remove) {
      slideDeleted = await this.slidesRepository.delete(id);
    } else {
      const Slide = await this.findOneSlide(id);

      // Check if Slide deleted
      if (Slide.deleted_at) throw new ConflictException(`Slide deleted before`);

      slideDeleted = await this.slidesRepository.softDelete(id);
    }

    // throw error if deleted fail
    if (slideDeleted.affected < 0) {
      throw new BadRequestException(`Can not delete Slide with id "${id}"`);
    }

    return {
      status: true,
      message: 'Xóa thành công',
    };
  }

  async deleteAll() {
    const deletedAll = await this.slidesRepository.delete({});

    if (deletedAll.affected < 0) {
      throw new BadRequestException(`Can not delete`);
    }

    return deletedAll;
  }
}
