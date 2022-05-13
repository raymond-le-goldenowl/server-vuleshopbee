import { UpdateCartDto } from './dto/update-cart.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsRepository } from './carts.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartsRepository) private cartsRepository: CartsRepository,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    let cartSaved: Cart;
    try {
      const cart = await this.cartsRepository.create({
        accept_guaratee_policy: createCartDto.accept_guaratee_policy,
      });

      cartSaved = await this.cartsRepository.save(cart);
    } catch (error) {
      throw error;
    }

    if (!cartSaved) throw new BadRequestException('Không thể tạo giỏ hàng');

    return cartSaved;
  }

  async findAll(withDeleted: boolean): Promise<Cart[]> {
    let carts: Cart[];
    try {
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
    } catch (error) {
      throw error;
    }

    return carts;
  }

  async findOneCartByAccessToken(user: User): Promise<Cart> {
    let cart: Cart;
    try {
      cart = await this.cartsRepository.findOne({
        withDeleted: true,
        relations: ['cartItem'],
        where: { id: user.cart.id },
      });
      if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');
    } catch (error) {
      throw error;
    }

    return cart;
  }

  async findOne(id: string, withDeleted: boolean): Promise<Cart> {
    let cart: Cart;
    try {
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
    } catch (error) {
      throw error;
    }

    if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');

    return cart;
  }

  async remove(id: string, remove: boolean) {
    try {
      const cart = await this.findOne(id, true);
      if (remove) {
        await this.cartsRepository.delete(cart.id);
      } else {
        await this.cartsRepository.softDelete(cart.id);
      }
    } catch (error) {
      throw error;
    }
  }

  async resetCart(id: string) {
    let cartSaved: Cart;
    try {
      const cart = await this.findOne(id, true);
      if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');

      cart.accept_guaratee_policy = false;
      cart.cartItem = null;

      cartSaved = await this.cartsRepository.save(cart);
    } catch (error) {
      throw error;
    }

    return cartSaved;
  }
}
