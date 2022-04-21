import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get()
  findAll(@Query('with_deleted') withDeleted: boolean) {
    return this.cartsService.findAll(withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get(':id')
  findOne(
    @Param('id') id: string,

    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.cartsService.findOne(id, withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Delete(':id')
  remove(
    @Param('id') id: string,

    @Query('remove') remove: boolean,
  ) {
    return this.cartsService.remove(id, remove);
  }
}
