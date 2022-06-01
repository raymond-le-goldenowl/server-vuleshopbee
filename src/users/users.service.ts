import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Cart } from 'src/carts/entities/cart.entity';

import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { SignInFbDto } from './dto/sigin-fb.dto';
import { CreateCartDto } from 'src/carts/dto/create-cart.dto';

import { UsersRepository } from './users.repository';

import { RolesService } from 'src/roles/roles.service';
import { CartsService } from 'src/carts/carts.service';
import { StripeService } from 'src/stripe/stripe.service';
import { ISocialMediaData } from './interfaces/social-media.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private roleService: RolesService,
    private cartsService: CartsService,
    private stripeService: StripeService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const userByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    return userByEmail;
  }

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

  signToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      provider: user.auth_type,
    };
    return this.jwtService.sign(
      { ...payload },
      {
        expiresIn: '1d',
      },
    );
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

  createObjectSignUpWithSocialMedia(data: ISocialMediaData) {
    const social_type =
      data.auth_type === 'facebook' ? 'user_facebook_id' : 'user_google_id';
    return {
      email: data.email,
      username: data.username,
      password: data.password,
      avatar: data.avatar,
      full_name: data.full_name,
      [`${social_type}`]: data.social_media_id,
      auth_type: data.auth_type,
      role: data.role,
      cart: data.cart,
      stripeCustomerId: data.stripeCustomerId,
      is_active: data.is_active,
    };
  }

  private createHashPassword(password: string) {
    // generate salt and hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  async signup(signUpDto: SignUpDto) {
    // destruct data
    const { password, email, username } = signUpDto;

    // find user by email to make sure user was exists
    const user = await this.getUserByEmail(email);

    // throw conflict error if user exists
    if (user) {
      throw new ConflictException('Người dùng đã tồn tại');
    }

    // Create relationship data for user
    const cart = await this.createCartForUser();
    const role = await this.roleService.findOneByText('user', true);
    const stripeCustomer = await this.stripeService.createCustomer(
      username,
      email,
    );

    // create and save username, password, email.
    const userSaved: User = await this.usersRepository.save({
      email,
      password: this.createHashPassword(password),
      username,
      role,
      cart,
      stripeCustomerId: stripeCustomer.id,
    });

    // remove data not need to show
    const userRefactored: User = this.removePrivateUserData(userSaved);

    const accessToken = this.signToken(userRefactored);
    return { accessToken };
  }

  async signin(signInDto: SignInDto) {
    const { password, email } = signInDto;

    // get user to check is user exists
    const userByEmail: User = await this.getUserByEmail(email);
    if (!userByEmail) {
      throw new UnauthorizedException(
        'Không tìm thấy người dùng với email = ' + email,
      );
    }

    // compare password
    const match = bcrypt.compareSync(password, userByEmail.password);
    if (!match) throw new UnauthorizedException('Mật khẩu không dúng');

    userByEmail.is_active = true;
    const userUpdated: User = await this.usersRepository.save(userByEmail);

    // remove data not need to show
    const userRefactored: User = this.removePrivateUserData(userUpdated);

    const accessToken = this.signToken(userRefactored);
    return { accessToken };
  }

  async logout(jwtUserData: any) {
    if (!jwtUserData) {
      throw new ForbiddenException('Không tìm thấy người dùng');
    }

    const user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.is_active = false;
    await this.usersRepository.save(user);

    return { logout: true };
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

  async signUpWithSocialMedia(user: SignInFbDto) {
    if (!user) {
      throw new BadRequestException('Không tìm thấy thông tin người dùng');
    }

    let userSaved: User;

    const email = user.email;
    const userByEmailAndAuthType = await this.getUserByEmailAndAuthType(
      email,
      user.provider,
    );

    if (!userByEmailAndAuthType) {
      const cart = await this.createCartForUser();
      const role = await this.roleService.findOneByText('user', true);

      // create customer
      const stripeCustomer = await this.stripeService.createCustomer(
        user.id,
        user.email,
      );
      // create and save username, password, email.
      userSaved = await this.usersRepository.save(
        this.createObjectSignUpWithSocialMedia({
          email,
          username: user.id,
          password: null,
          avatar: user?.picture,
          full_name: user.displayName,
          social_media_id: user.id,
          auth_type: user.provider,
          role,
          cart,
          stripeCustomerId: stripeCustomer.id,
          is_active: true,
        }),
      );
    } else {
      userByEmailAndAuthType.is_active = true;
      userSaved = await this.usersRepository.save(userByEmailAndAuthType);
    }

    // remove data not need to show
    const userRefactored: User = this.removePrivateUserData(userSaved);

    const accessToken = this.signToken(userRefactored);
    return { accessToken };
  }

  async createCartForUser(): Promise<Cart> {
    const createCartDto: CreateCartDto = { accept_guaratee_policy: false };
    return await this.cartsService.create(createCartDto);
  }
}
