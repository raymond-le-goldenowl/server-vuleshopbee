import {
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  /**
   * Create A Keyword
   * @param createKeywordDto CreateKeywordDto
   * @returns Keyword
   */
  @Post()
  create(@Body() createKeywordDto: CreateKeywordDto) {
    console.log(createKeywordDto);
    return this.keywordsService.create(createKeywordDto);
  }

  /**
   * Get All Keywords
   * @returns Keywords[]
   */
  @Get()
  findAll() {
    return this.keywordsService.findAll();
  }

  /**
   * Get One Keyword
   * @param id string
   * @returns Keyword
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keywordsService.findOneKeyword(id);
  }

  /**
   * Update A Keyword By ID
   * @param id string
   * @param updateKeywordDto UpdateKeywordDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordsService.update(id, updateKeywordDto);
  }

  /**
   * Delete Keywords
   * @returns
   */
  @Delete('/all')
  deleteAll() {
    return this.keywordsService.deleteAll();
  }

  /**
   * Delete A Keyword
   * @param id string
   * @param remove is delete
   * @returns
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.keywordsService.delete(id, remove);
  }
}
