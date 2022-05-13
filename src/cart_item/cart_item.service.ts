import { ProductsService } from './../products/products.service';
import { CartsService } from './../carts/carts.service';
import { CartItem } from './entities/cart_item.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemRepository } from './cart_item.repository';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemRepository)
    private cartItemRepository: CartItemRepository,
    private cartsService: CartsService,
    private productsService: ProductsService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const { cartId, productId, quantity } = createCartItemDto;
    let cartItemSaved;
    try {
      const cart = await this.cartsService.findOne(cartId, true);
      const product = await (
        await this.productsService.findOne(productId)
      ).product;

      const findProductIsExists = await this.cartItemRepository.findOne({
        where: {
          product,
        },
      });

      // if (product.amount === 0) {
      //   throw new BadRequestException('Số lượng sản phẩm không đủ');
      // }
      // if (
      //   product.amount -
      //     (createCartItemDto.quantity + (findProductIsExists?.quantity || 0)) <
      //   0
      // ) {
      //   throw new BadRequestException('Số lượng sản phẩm không đủ');
      // }

      // if exists product in cart, will be update quantity
      if (findProductIsExists) {
        return await this.updateQuantityOfItem(findProductIsExists.id, {
          quantity: findProductIsExists.quantity + quantity,
          cartId,
          productId,
        });
      } else {
        const cartItem = await this.cartItemRepository.create({
          ...createCartItemDto,
          cart,
          product,
        });
        cartItemSaved = await this.cartItemRepository.save(cartItem);
      }
    } catch (error) {
      throw error;
    }

    if (!cartItemSaved)
      throw new BadRequestException('Không thể đưa sản phẩm vào giỏ hàng');

    return cartItemSaved;
  }

  async findAll(withDeleted: boolean, cartId: string) {
    let cartItems: CartItem[];

    try {
      const cart = await this.cartsService.findOne(cartId, true);

      if (withDeleted) {
        cartItems = await this.cartItemRepository.find({
          relations: ['cart', 'product'],
          withDeleted: true,
          where: { cart },
        });
      } else {
        cartItems = await this.cartItemRepository.find({
          relations: ['cart', 'product'],
          where: { cart },
        });
      }
    } catch (error) {
      throw error;
    }

    if (!cartItems)
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');

    return cartItems;
  }

  async findOne(
    id: string,
    withDeleted: boolean,
    cartId: string,
    productId: string,
  ) {
    let cartItem: CartItem;

    try {
      const cart = await this.cartsService.findOne(cartId, true);
      const product = await (
        await this.productsService.findOne(productId)
      ).product;

      if (withDeleted) {
        cartItem = await this.cartItemRepository.findOne({
          relations: ['cart', 'product'],
          withDeleted: true,
          where: { id, cart, product },
        });
      } else {
        cartItem = await this.cartItemRepository.findOne({
          relations: ['cart', 'product'],
          where: { id, cart, product },
        });
      }
    } catch (error) {
      throw error;
    }

    return cartItem;
  }

  async updateQuantityOfItem(id: string, updateCartItemDto: UpdateCartItemDto) {
    let cartItemUpdated: CartItem;

    const { cartId, productId } = updateCartItemDto;
    try {
      let cartItem = await this.findOne(id, true, cartId, productId);

      const cart = await this.cartsService.findOne(cartId, true);
      const product = await (
        await this.productsService.findOne(productId)
      ).product;

      // Kiểm tra số lượng sản phẩm còn đủ để thêm vào giỏ hàng hay không
      // if (product.amount === 0) {
      //   throw new BadRequestException('Số lượng sản phẩm không đủ');
      // }

      // if (
      //   product.amount -
      //     (updateCartItemDto.quantity + (cartItem?.quantity || 0)) <
      //   0
      // ) {
      //   throw new BadRequestException('Số lượng sản phẩm không đủ');
      // }
      // tính toán cập nhập tăng hoặc giảm số lượng
      if (updateCartItemDto.quantity !== 0 && !updateCartItemDto.quantity) {
        updateCartItemDto.quantity = Number(cartItem.quantity) + 1;
      } else {
        updateCartItemDto.quantity = Number(updateCartItemDto.quantity);
      }
      cartItem = { ...cartItem, ...updateCartItemDto, cart, product };
      cartItemUpdated = await this.cartItemRepository.save(cartItem);
    } catch (error) {
      throw error;
    }

    if (!cartItemUpdated)
      throw new BadRequestException('Không thể cập nhập giỏ hàng');

    return cartItemUpdated;
  }

  async remove(id: string, remove: boolean, cartId: string, productId: string) {
    try {
      const cartItem = await this.findOne(id, true, cartId, productId);
      if (remove) {
        await this.cartItemRepository.delete(cartItem.id);
      } else {
        await this.cartItemRepository.softDelete(cartItem.id);
      }
    } catch (error) {
      throw error;
    }
  }

  async removeCartItemByCartId(cartId: string) {
    const removed = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .delete()
      .from(CartItem)
      .where('cartId = :cartId', { cartId })
      .execute();

    return { removedCount: removed.affected };
  }
}
