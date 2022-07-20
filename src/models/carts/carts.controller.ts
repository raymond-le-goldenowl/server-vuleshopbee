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
import { GetCurrentUserDecorator } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/authentication/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('v1/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll(@Query('with_deleted') withDeleted: boolean) {
    return this.cartsService.findAll(withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Get('/one')
  findOneCartByAccessToken(@GetCurrentUserDecorator() user) {
    return this.cartsService.findOneCartByAccessToken(user);
  }

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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post('/reset-cart')
  resetCart(@GetCurrentUserDecorator() user) {
    const cartId = user.cart.id || null;
    return this.cartsService.resetCart(cartId);
  }
}
