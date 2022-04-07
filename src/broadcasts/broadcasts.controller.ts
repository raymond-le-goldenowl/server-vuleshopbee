import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BroadcastsService } from './broadcasts.service';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';

@Controller('broadcasts')
export class BroadcastsController {
  constructor(private readonly broadcastsService: BroadcastsService) {}

  @Post()
  create(@Body() createBroadcastDto: CreateBroadcastDto) {
    return this.broadcastsService.create(createBroadcastDto);
  }

  @Get()
  findAll() {
    return this.broadcastsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBroadcastDto: UpdateBroadcastDto,
  ) {
    return this.broadcastsService.update(+id, updateBroadcastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.broadcastsService.remove(+id);
  }
}
