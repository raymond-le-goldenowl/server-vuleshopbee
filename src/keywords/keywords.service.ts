import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { KeywordsRepository } from './keywords.repository';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordsRepository)
    private keywordsRepository: KeywordsRepository,
  ) {}

  async create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    createKeywordDto.icon = '';
    // save and assign a result saved
    const saved = await this.keywordsRepository.save(createKeywordDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save object`);
    }

    return saved;
  }

  async findAll(): Promise<Keyword[]> {
    const Keywords = await this.keywordsRepository.find({ withDeleted: true });
    return Keywords;
  }

  async findOneKeyword(id: string): Promise<Keyword> {
    // find one Keyword by id and with deleted
    const Keyword = await this.keywordsRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    // throw error if deleted fail
    if (!Keyword) {
      throw new NotFoundException(`Keyword with id "${id}" not found`);
    }

    return Keyword;
  }

  async update(
    id: string,
    updateKeywordDto: UpdateKeywordDto,
  ): Promise<Keyword> {
    // get Keyword want to update
    const keyword = await this.findOneKeyword(id);

    // replace data with new values
    keyword.href = updateKeywordDto.href;
    keyword.text = updateKeywordDto.text;

    // update with new values
    const keywordUpdated = await this.keywordsRepository.save(keyword);

    return keywordUpdated;
  }

  async delete(id: string, remove: boolean) {
    // set `DATETIME` for delete column
    let KeywordDeleted;
    if (remove) {
      KeywordDeleted = await this.keywordsRepository.delete(id);
    } else {
      const Keyword = await this.findOneKeyword(id);

      // Check if Keyword deleted
      if (Keyword.deleted_at) {
        throw new ConflictException(`Keyword deleted before`);
      }

      KeywordDeleted = await this.keywordsRepository.softDelete(id);
    }

    // throw error if deleted fail
    if (KeywordDeleted.affected < 0) {
      throw new BadRequestException(`Can not delete Keyword with id "${id}"`);
    }

    return {
      status: true,
      message: 'Delete successfully',
    };
  }

  async deleteAll() {
    const deletedAll = await this.keywordsRepository.delete({});

    if (deletedAll.affected < 0) {
      throw new BadRequestException(`Can not delete`);
    }

    return deletedAll;
  }
}
