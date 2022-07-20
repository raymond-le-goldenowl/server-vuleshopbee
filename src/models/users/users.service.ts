import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) public usersRepository: UsersRepository,
  ) {}

  async getUserByEmailAndAuthType(
    email: string,
    auth_type: string,
  ): Promise<User | null> {
    const userByEmailAndAuthType = await this.usersRepository.findOne({
      relations: ['role', 'cart'],
      where: { email, auth_type },
    });

    if (!userByEmailAndAuthType) {
      return null;
    }

    return userByEmailAndAuthType;
  }

  async getUserByEmail(email: string): Promise<User> {
    const userByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    return userByEmail;
  }

  async getUserById(id: string): Promise<User> {
    const userById = await this.usersRepository.findOne({
      relations: ['cart', 'role'],
      where: { id },
    });

    return userById;
  }

  removePrivateUserData(user: User): User {
    delete user.cart?.user;
    delete user.cart?.cartItem;
    delete user.cart?.created_at;
    delete user.cart?.deleted_at;
    delete user.cart?.updated_at;
    delete user.cart?.accept_guaratee_policy;

    delete user.role?.created_at;
    delete user.role?.deleted_at;
    delete user.role?.updated_at;

    delete user.citizen_identity;
    delete user.created_at;
    delete user.deleted_at;
    delete user.password;
    delete user.public;
    delete user.updated_at;

    return user;
  }

  async updateImage(jwtUserData: any, image: any) {
    if (!jwtUserData) {
      throw new ForbiddenException('Không tìm thấy người dùng');
    }

    const user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.avatar = image.filename;
    const userUpdated = await this.usersRepository.save(user);

    return this.removePrivateUserData(userUpdated);
  }

  async saveUser(user: User | any): Promise<User> {
    return this.usersRepository.save(user);
  }
}
