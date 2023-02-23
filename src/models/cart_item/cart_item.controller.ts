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
import { GetCurrentUserDecorator } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/models/users/entities/user.entity';
import { Role } from 'src/authentication/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CartItemService } from './cart_item.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { DeleteCartItemDto } from './dto/delete-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller('v1/cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Post()
  async create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Post('/save-items-combined')
  async saveItemsCombined(
    @Body('mergedArray')
    mergedArray: [
      {
        cartItemId: string;
        productId: string;
        quantity: number;
      },
    ],
    @GetCurrentUserDecorator() user: User,
  ) {
    return this.cartItemService.saveItemsCombined(mergedArray, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get()
  findAll(
    @Query('with_deleted') withDeleted: boolean,
    @Body('cartId') cartId: string,
  ) {
    return this.cartItemService.findAll(withDeleted, cartId);
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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Delete('/remove')
  deleteCartItemsByCartId(@GetCurrentUserDecorator() user: User) {
    const cartId = user.cart.id || null;
    return this.cartItemService.removeCartItemByCartId(cartId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Query() deleteCartItemDto: DeleteCartItemDto,
  ) {
    return this.cartItemService.remove(
      id,
      deleteCartItemDto.remove,
      deleteCartItemDto.cartId,
      deleteCartItemDto.productId,
    );
  }
}
