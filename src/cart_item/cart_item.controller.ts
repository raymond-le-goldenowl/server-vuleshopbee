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
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { CartItemService } from './cart_item.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Post()
  create(
    @Body() createCartItemDto: CreateCartItemDto,
    @Body('cartId') cartId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartItemService.create(createCartItemDto, cartId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get()
  findAll(
    @Query('with_deleted') withDeleted: boolean,
    @Body('cartId') cartId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartItemService.findAll(withDeleted, cartId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
    @Body('cartId') cartId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartItemService.findOne(id, withDeleted, cartId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Body('cartId') cartId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartItemService.updateQuantityOfItem(
      id,
      updateCartItemDto,
      cartId,
      productId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Delete(':id')
  deleteCartItemsByCartId(
    @Param('id') id: string,
    @Query('remove') remove: boolean,
    @Body('cartId') cartId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartItemService.remove(id, remove, cartId, productId);
  }
}
