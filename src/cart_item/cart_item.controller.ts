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
  Req,
} from '@nestjs/common';
import { GetCurrentUserDecorator } from 'src/users/decorators/get-user.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { CartItemService } from './cart_item.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { DeleteCartItemDto } from './dto/delete-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
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
  ) {
    return this.cartItemService.updateQuantityOfItem(id, updateCartItemDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.User)
  // @Delete(':id')
  // deleteCartItemsByCartId(
  //   @Req() req,
  //   @Param('id') id: string,
  //   @Query() deleteCartItemDto: DeleteCartItemDto,
  // ) {
  //   return this.cartItemService.remove(
  //     id,
  //     deleteCartItemDto.remove,
  //     deleteCartItemDto.cartId,
  //     deleteCartItemDto.productId,
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Delete('/remove')
  deleteCartItemsByCartId(@GetCurrentUserDecorator() user: User) {
    const cartId = user.cart.id || null;
    return this.cartItemService.removeCartItemByCartId(cartId);
  }
}
