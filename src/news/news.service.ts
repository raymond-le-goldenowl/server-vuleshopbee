import { isURL } from 'class-validator';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { News } from './entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsRepository } from './news.repository';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
  ) {}

  async create(icon, createNewDto: CreateNewsDto): Promise<News> {
    // return icon;
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    createNewDto.text = 'search';

    if (isURL(createNewDto.href)) {
      createNewDto.text = 'url';
    }

    // create path point to images resource
    const path = `/News/images/${icon?.filename}`;
    createNewDto.icon = path;

    // save and assign a result saved
    const saved = await this.newsRepository.save(createNewDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save object`);
    }

    return saved;
  }

  async findAll(): Promise<News[]> {
    const News = await this.newsRepository.find({ withDeleted: true });
    return News;
  }

  async findOneNews(id: string): Promise<News> {
    // find one New by id and with deleted
    const New = await this.newsRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    // throw error if deleted fail
    if (!New) {
      throw new NotFoundException(`New with id "${id}" not found`);
    }

    return New;
  }

  async update(icon, id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    // get New want to update
    const New = await this.findOneNews(id);

    // check path
    if (!icon?.filename) {
      throw new BadRequestException();
    }

    // create path point to images resource
    const path = `/News/images/${icon?.filename}`;

    // replace data with new values
    New.icon = path;
    New.href = updateNewsDto.href;

    New.text = 'search';
    if (isURL(New.href)) {
      New.text = 'url';
    }

    New.deleted_at = null;

    // update with new values
    const NewUpdated = await this.newsRepository.save(New);

    return NewUpdated;
  }

  async delete(id: string, remove: boolean) {
    // set `DATETIME` for delete column
    let NewDeleted;
    if (remove) {
      NewDeleted = await this.newsRepository.delete(id);
    } else {
      const New = await this.findOneNews(id);

      // Check if New deleted
      if (New.deleted_at) throw new ConflictException(`New deleted before`);

      NewDeleted = await this.newsRepository.softDelete(id);
    }

    // throw error if deleted fail
    if (NewDeleted.affected < 0) {
      throw new BadRequestException(`Can not delete New with id "${id}"`);
    }

    return {
      status: true,
      message: 'Delete successfully',
    };
  }

  async deleteAll() {
    const deletedAll = await this.newsRepository.delete({});

    if (deletedAll.affected < 0) {
      throw new BadRequestException(`Can not delete`);
    }

    return deletedAll;
  }
}
