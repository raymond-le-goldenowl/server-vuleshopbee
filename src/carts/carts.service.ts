import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCartDto } from './dto/create-cart.dto';

import { CartsRepository } from './carts.repository';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartsRepository) private cartsRepository: CartsRepository,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartsRepository.create({
      accept_guaratee_policy: createCartDto.accept_guaratee_policy,
    });

    const cartSaved = await this.cartsRepository.save(cart);
    if (!cartSaved) throw new BadRequestException('Không thể tạo giỏ hàng');

    return cartSaved;
  }

  async findAll(withDeleted: boolean): Promise<Cart[]> {
    let carts: Cart[];
    if (withDeleted) {
      carts = await this.cartsRepository.find({
        relations: ['cartItem'],
        withDeleted: true,
      });
    } else {
      carts = await this.cartsRepository.find({
        relations: ['cartItem'],
      });
    }

    return carts;
  }

  async findOneCartByAccessToken(user: User): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      withDeleted: true,
      relations: ['cartItem'],
      where: { id: user.cart.id },
    });
    if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');

    return cart;
  }

  async findOne(id: string, withDeleted: boolean): Promise<Cart> {
    let cart: Cart;
    if (withDeleted) {
      cart = await this.cartsRepository.findOne({
        withDeleted: true,
        relations: ['cartItem'],
        where: { id },
      });
    } else {
      cart = await this.cartsRepository.findOne({
        relations: ['cartItem'],
        where: { id },
      });
    }
    if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');

    return cart;
  }

  async remove(
    id: string,
    remove: boolean,
  ): Promise<DeleteResult | UpdateResult> {
    const cart = await this.findOne(id, true);
    if (remove) {
      return await this.cartsRepository.delete(cart.id);
    }
    return await this.cartsRepository.softDelete(cart.id);
  }

  async resetCart(id: string): Promise<Cart> {
    const cart = await this.findOne(id, true);

    cart.accept_guaratee_policy = false;
    cart.cartItem = null;

    const cartSaved = await this.cartsRepository.save(cart);

    return cartSaved;
  }
}
