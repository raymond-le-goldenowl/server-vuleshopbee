import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
} from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

import { config } from './file-interceptor.config';
import { SlidesService } from './slides.service';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { CreateSlideDto } from './dto/create-slide.dto';

@Controller('v1/slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  /**
   * Create A Slide
   * @param icon file
   * @param createSlideDto CreateSlideDto
   * @returns Slide
   */
  @Post()
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  create(@UploadedFile() icon, @Body() createSlideDto: CreateSlideDto) {
    return this.slidesService.create(icon, createSlideDto);
  }

  /**
   * Get All Slides
   * @returns Slides[]
   */
  @Get()
  findAll() {
    return this.slidesService.findAll();
  }

  /**
   * Get One Slide
   * @param id string
   * @returns Slide
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slidesService.findOneSlide(id);
  }

  /**
   * Update A Slide By ID
   * @param icon file
   * @param id string
   * @param updateSlideDto UpdateSlideDto
   * @returns
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  update(
    @UploadedFile() icon,
    @Param('id') id: string,
    @Body() updateSlideDto: UpdateSlideDto,
  ) {
    return this.slidesService.update(icon, id, updateSlideDto);
  }

  /**
   * Delete Slides
   * @returns
   */
  @Delete('/all')
  deleteAll() {
    return this.slidesService.deleteAll();
  }

  /**
   * Delete A Slide
   * @param id string
   * @param remove is delete
   * @returns
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.slidesService.delete(id, remove);
  }

  /**
   * Get Slides Images
   * @param imagePath name of image
   * @param res response
   * @returns image file
   */
  @Get('images/:imagePath')
  serveAvatar(@Param('imagePath') imagePath, @Res() res): Observable<any> {
    return of(res.sendFile(join(process.cwd(), 'uploads/slide/' + imagePath)));
  }
}
