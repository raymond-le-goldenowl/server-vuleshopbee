import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsRepository } from './carts.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';

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

    if (!cartSaved) throw new BadRequestException();

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

    if (!cart) throw new NotFoundException();

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
}
