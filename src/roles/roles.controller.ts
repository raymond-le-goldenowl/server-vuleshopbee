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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/users/decorators/roles.decorator';

@Controller('v1/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get()
  findAll(@Query('with_deleted') withDeleted: boolean) {
    return this.rolesService.findAll(withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.rolesService.findOne(id, withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.rolesService.remove(id, remove);
  }
}
