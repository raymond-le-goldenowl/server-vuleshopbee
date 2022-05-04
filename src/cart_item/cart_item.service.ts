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

      // if exists product in cart, will be update quantity
      if (findProductIsExists) {
        return await this.updateQuantityOfItem(findProductIsExists.id, {
          quantity,
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

    if (!cartItemSaved) throw new BadRequestException();

    return cartItemSaved;
  }

  async findAll(withDeleted: boolean, cartId: string, productId: string) {
    let cartItems: CartItem[];

    try {
      const cart = await this.cartsService.findOne(cartId, true);
      const product = await (
        await this.productsService.findOne(productId)
      ).product;

      if (withDeleted) {
        cartItems = await this.cartItemRepository.find({
          relations: ['cart', 'product'],
          withDeleted: true,
          where: { cart, product },
        });
      } else {
        cartItems = await this.cartItemRepository.find({
          relations: ['cart', 'product'],
          where: { cart, product },
        });
      }
    } catch (error) {
      throw error;
    }

    if (!cartItems) throw new NotFoundException();

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

      if (!updateCartItemDto.quantity) {
        updateCartItemDto.quantity = Number(cartItem.quantity) + 1;
      } else {
        // updateCartItemDto.quantity =
        // Number(cartItem.quantity) + Number(updateCartItemDto.quantity);
        updateCartItemDto.quantity = Number(updateCartItemDto.quantity);
      }
      cartItem = { ...cartItem, ...updateCartItemDto, cart, product };
      cartItemUpdated = await this.cartItemRepository.save(cartItem);
    } catch (error) {
      throw error;
    }

    if (!cartItemUpdated) throw new BadRequestException();

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
