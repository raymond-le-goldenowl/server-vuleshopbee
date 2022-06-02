import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/users/decorators/roles.decorator';

@Controller('v1/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get()
  findAll(@Query('with_deleted') withDeleted) {
    return this.tagsService.findAll(withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.tagsService.findOne(id, withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.tagsService.remove(id, remove);
  }
}
