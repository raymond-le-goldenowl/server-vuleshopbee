import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

import { CartItemRepository } from './cart_item.repository';

import { CartsService } from './../carts/carts.service';
import { ProductsService } from './../products/products.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemRepository)
    private cartItemRepository: CartItemRepository,
    private cartsService: CartsService,
    private productsService: ProductsService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const { cartId, productId, quantity } = createCartItemDto;
    let cartItemSaved: CartItem;

    const cart = await this.cartsService.findOne(cartId, true);
    const product = (await this.productsService.findOne(productId)).product;

    const findProductIsExists = await this.cartItemRepository.findOne({
      where: {
        product,
      },
    });

    if (product.amount === 0) {
      throw new BadRequestException('Số lượng sản phẩm không đủ');
    }
    if (
      product.amount -
        (createCartItemDto.quantity + (findProductIsExists?.quantity || 0)) <
      0
    ) {
      throw new BadRequestException('Số lượng sản phẩm không đủ');
    }

    // if exists product in cart, will be update quantity
    if (findProductIsExists) {
      cartItemSaved = await this.updateQuantityOfItem(findProductIsExists.id, {
        quantity: findProductIsExists.quantity + quantity,
        cartId,
        productId,
      });
    } else {
      // create cart item
      const cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        cart,
        product,
      });
      cartItemSaved = await this.cartItemRepository.save(cartItem);
    }

    delete cartItemSaved.cart;
    return cartItemSaved;
  }

  async findAll(withDeleted: boolean, cartId: string): Promise<CartItem[]> {
    let cartItems: CartItem[];

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

    return cartItems;
  }

  async findOne(
    id: string,
    withDeleted: boolean,
    cartId: string,
    productId: string,
  ): Promise<CartItem> {
    let cartItem: CartItem;
    const cart = await this.cartsService.findOne(cartId, true);
    const product = (await this.productsService.findOne(productId)).product;

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

    if (!withDeleted)
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    return cartItem;
  }

  async updateQuantityOfItem(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const { cartId, productId } = updateCartItemDto;
    let cartItem = await this.findOne(id, true, cartId, productId);
    const cart = await this.cartsService.findOne(cartId, true);
    const product = (await this.productsService.findOne(productId)).product;

    // Kiểm tra số lượng sản phẩm còn đủ để thêm vào giỏ hàng hay không
    if (product.amount === 0) {
      throw new BadRequestException('Số lượng sản phẩm không đủ');
    }

    if (product.amount - updateCartItemDto.quantity < 0) {
      throw new BadRequestException('Số lượng sản phẩm không đủ');
    }

    // tính toán cập nhập tăng hoặc giảm số lượng
    if (updateCartItemDto.quantity !== 0 && !updateCartItemDto.quantity) {
      updateCartItemDto.quantity = Number(cartItem.quantity) + 1;
    } else {
      updateCartItemDto.quantity = Number(updateCartItemDto.quantity);
    }
    cartItem = { ...cartItem, ...updateCartItemDto, cart, product };
    return await this.cartItemRepository.save(cartItem);
  }

  async remove(
    id: string,
    remove: boolean,
    cartId: string,
    productId: string,
  ): Promise<DeleteResult | UpdateResult> {
    const cartItem = await this.findOne(id, true, cartId, productId);
    if (remove) {
      return await this.cartItemRepository.delete(cartItem.id);
    }
    return await this.cartItemRepository.softDelete(cartItem.id);
  }

  async removeCartItemByCartId(cartId: string): Promise<DeleteResult> {
    return await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .delete()
      .from(CartItem)
      .where('cartId = :cartId', { cartId })
      .execute();
  }
}
