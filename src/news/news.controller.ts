import {
  Get,
  Post,
  Res,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

import { NewsService } from './news.service';
import { config } from './file-interceptor.config';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * Create A News
   * @param icon file
   * @param createNewsDto CreateNewsDto
   * @returns News
   */
  @Post()
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  create(@UploadedFile() icon, @Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(icon, createNewsDto);
  }

  /**
   * Get All News
   * @returns News[]
   */
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  /**
   * Get One News
   * @param id string
   * @returns News
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOneNews(id);
  }

  /**
   * Update A News By ID
   * @param icon file
   * @param id string
   * @param updateNewsDto UpdateNewsDto
   * @returns
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  update(
    @UploadedFile() icon,
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(icon, id, updateNewsDto);
  }

  /**
   * Delete Newss
   * @returns
   */
  @Delete('/all')
  deleteAll() {
    return this.newsService.deleteAll();
  }

  /**
   * Delete A News
   * @param id string
   * @param remove is delete
   * @returns
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.newsService.delete(id, remove);
  }

  /**
   * Get News Images
   * @param imagePath name of image
   * @param res response
   * @returns image file
   */
  @Get('images/:imagePath')
  serveAvatar(@Param('imagePath') imagePath, @Res() res): Observable<any> {
    return of(res.sendFile(join(process.cwd(), 'uploads/news/' + imagePath)));
  }
}
