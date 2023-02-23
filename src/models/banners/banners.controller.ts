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

@Controller('v1/banners')
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
  findAll(@Query('with_deleted') withDeleted: boolean) {
    return this.bannersService.findAll(withDeleted);
  }

  /**
   * Get One Banner
   * @param id string
   * @returns Banner
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.bannersService.findOneBanner(id, withDeleted);
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
}
