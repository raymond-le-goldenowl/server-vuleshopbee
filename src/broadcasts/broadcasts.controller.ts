import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { join } from 'path';
import { of, Observable } from 'rxjs';

import { BroadcastsService } from './broadcasts.service';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';

@Controller('broadcasts')
export class BroadcastsController {
  constructor(private readonly broadcastsService: BroadcastsService) {}
  /**
   * Create A Broadcast
   * @param createBroadcastDto CreateBroadcastDto
   * @returns Broadcast
   */
  @Post()
  create(@Body() createBroadcastDto: CreateBroadcastDto) {
    return this.broadcastsService.create(createBroadcastDto);
  }

  /**
   * Get All Broadcasts
   * @returns Broadcasts[]
   */
  @Get()
  findAll() {
    return this.broadcastsService.findAll();
  }

  /**
   * Get One Broadcast
   * @param id string
   * @returns Broadcast
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastsService.findOneBroadcast(id);
  }

  /**
   * Update A Broadcast By ID
   * @param id string
   * @param updateBroadcastDto UpdateBroadcastDto
   * @returns
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBroadcastDto: UpdateBroadcastDto,
  ) {
    return this.broadcastsService.update(id, updateBroadcastDto);
  }

  /**
   * Delete Broadcasts
   * @returns
   */
  @Delete('/all')
  deleteAll() {
    return this.broadcastsService.deleteAll();
  }

  /**
   * Delete A Broadcast
   * @param id string
   * @param remove is delete
   * @returns
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.broadcastsService.delete(id, remove);
  }

  /**
   * Get Broadcasts Images
   * @param imagePath name of image
   * @param res response
   * @returns image file
   */
  @Get('images/:imagePath')
  serveAvatar(@Param('imagePath') imagePath, @Res() res): Observable<any> {
    return of(res.sendFile(join(process.cwd(), imagePath)));
  }
}
