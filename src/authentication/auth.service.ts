import { UsersService } from 'src/models/users/users.service';
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

import { Cart } from 'src/models/carts/entities/cart.entity';

import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { CreateCartDto } from 'src/models/carts/dto/create-cart.dto';

import { RolesService } from 'src/models/roles/roles.service';
import { CartsService } from 'src/models/carts/carts.service';
import { StripeService } from 'src/models/stripe/stripe.service';
import { ISocialMediaData } from './interfaces/social-media.interface';
import { Role } from './enums/role.enum';
import { SignInWithSocialDto } from './dto/sigin-social.dto';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: RolesService,
    private cartsService: CartsService,
    private stripeService: StripeService,
  ) {}

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
    const user = await this.usersService.getUserByEmail(email);

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
    const userSaved: User = await this.usersService.saveUser({
      email,
      password: this.createHashPassword(password),
      username,
      role,
      cart,
      stripeCustomerId: stripeCustomer.id,
    });

    // remove data not need to show
    const userRefactored: User =
      this.usersService.removePrivateUserData(userSaved);

    const accessToken = this.signToken(userRefactored);
    return { accessToken };
  }

  async signin(signInDto: SignInDto) {
    const { password, email } = signInDto;

    // get user to check is user exists
    const userByEmail: User = await this.usersService.getUserByEmail(email);
    if (!userByEmail) {
      throw new UnauthorizedException(
        'Không tìm thấy người dùng với email = ' + email,
      );
    }

    // compare password
    const match = bcrypt.compareSync(password, userByEmail.password);
    if (!match) throw new UnauthorizedException('Mật khẩu không dúng');

    userByEmail.is_active = true;
    const userUpdated: User = await this.usersService.saveUser(userByEmail);

    // remove data not need to show
    const userRefactored: User =
      this.usersService.removePrivateUserData(userUpdated);

    const accessToken = this.signToken(userRefactored);
    return { accessToken };
  }

  async logout(jwtUserData: any) {
    if (!jwtUserData) {
      throw new ForbiddenException('Không tìm thấy người dùng');
    }

    const user = await this.usersService.getUserById(jwtUserData.id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.is_active = false;
    await this.usersService.saveUser(user);

    return { logout: true };
  }

  async signUpWithSocialMedia(user: SignInWithSocialDto) {
    if (!user) {
      throw new BadRequestException('Không tìm thấy thông tin người dùng');
    }

    let userSaved: User;

    const email = user.email;
    const userByEmailAndAuthType =
      await this.usersService.getUserByEmailAndAuthType(email, user.provider);

    if (!userByEmailAndAuthType) {
      const cart = await this.createCartForUser();
      const role = await this.roleService.findOneByText(Role.User, true);

      // create customer
      const stripeCustomer = await this.stripeService.createCustomer(
        user.id,
        user.email,
      );
      // create and save username, password, email.
      userSaved = await this.usersService.saveUser(
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
      userSaved = await this.usersService.saveUser(userByEmailAndAuthType);
    }

    // TODO:  remove data not need to show. lodash
    const userRefactored: User =
      this.usersService.removePrivateUserData(userSaved);

    const accessToken = this.signToken(userRefactored);
    return { accessToken };
  }

  async createCartForUser(): Promise<Cart> {
    const createCartDto: CreateCartDto = { accept_guaratee_policy: false };
    return await this.cartsService.create(createCartDto);
  }
}
