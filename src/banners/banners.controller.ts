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
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  /**
   * Create A Banner
   * @param icon file
   * @param createBannerDto CreateBannerDto
   * @returns Banner
   */
  @Post()
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  create(@UploadedFile() icon, @Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(icon, createBannerDto);
  }

  /**
   * Get All Banners
   * @returns Banners[]
   */
  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  /**
   * Get One Banner
   * @param id string
   * @returns Banner
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOneBanner(id);
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
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannersService.update(icon, id, updateBannerDto);
  }

  /**
   * Delete Banners
   * @returns
   */
  @Delete('/all')
  deleteAll() {
    return this.bannersService.deleteAll();
  }

  /**
   * Delete A Banner
   * @param id string
   * @param remove is delete
   * @returns
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.bannersService.delete(id, remove);
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
