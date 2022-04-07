import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FloatingService } from './floating.service';
import { CreateFloatingDto } from './dto/create-floating.dto';
import { UpdateFloatingDto } from './dto/update-floating.dto';

@Controller('floating')
export class FloatingController {
  constructor(private readonly floatingService: FloatingService) {}

  @Post()
  create(@Body() createFloatingDto: CreateFloatingDto) {
    return this.floatingService.create(createFloatingDto);
  }

  @Get()
  findAll() {
    return this.floatingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floatingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFloatingDto: UpdateFloatingDto,
  ) {
    return this.floatingService.update(+id, updateFloatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floatingService.remove(+id);
  }
}
