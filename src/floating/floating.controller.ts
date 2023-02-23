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
import { FloatingService } from './floating.service';
import { CreateFloatingDto } from './dto/create-floating.dto';
import { UpdateFloatingDto } from './dto/update-floating.dto';

@Controller('v1/floating')
export class FloatingController {
  constructor(private readonly floatingService: FloatingService) {}

  /**
   * Create A Banner
   * @param icon file
   * @param createBannerDto CreateBannerDto
   * @returns Banner
   */
  @Post()
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  create(@UploadedFile() icon, @Body() createFloatingDto: CreateFloatingDto) {
    return this.floatingService.create(icon, createFloatingDto);
  }

  /**
   * Get All Banners
   * @returns Banners[]
   */
  @Get()
  findAll() {
    return this.floatingService.findAll();
  }

  /**
   * Get One Banner
   * @param id string
   * @returns Banner
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floatingService.findOneBanner(id);
  }

  /**
   * Update A Banner By ID
   * @param icon file
   * @param id string
   * @param updateBannerDto UpdateBannerDto
   * @returns
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  update(
    @UploadedFile() icon,
    @Param('id') id: string,
    @Body() updateFloatingDto: UpdateFloatingDto,
  ) {
    return this.floatingService.update(icon, id, updateFloatingDto);
  }

  /**
   * Delete Banners
   * @returns
   */
  @Delete('/all')
  deleteAll() {
    return this.floatingService.deleteAll();
  }

  /**
   * Delete A Banner
   * @param id string
   * @param remove is delete
   * @returns
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.floatingService.delete(id, remove);
  }

  /**
   * Get Banners Images
   * @param imagePath name of image
   * @param res response
   * @returns image file
   */
  @Get('images/:imagePath')
  serveAvatar(@Param('imagePath') imagePath, @Res() res): Observable<any> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/banners/' + imagePath)),
    );
  }
}
