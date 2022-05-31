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

import { trimSingleObjectValue } from 'src/utils/trim-single-object-value';

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

    if (!userByEmail) {
      throw new UnauthorizedException(
        'Không tìm thấy người dùng với email = ' + email,
      );
    }

    return trimSingleObjectValue(userByEmail) as User;
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

    return trimSingleObjectValue(userByEmailAndAuthType) as User;
  }

  signToken(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      provider: user.auth_type,
    };
    return this.jwtService.sign(
      { ...payload },
      {
        expiresIn: '1d',
      },
    );
  }

  async signup(signUpDto: SignUpDto) {
    const { password, email } = signUpDto;

    const user = await this.getUserByEmail(email);

    if (user) {
      throw new ConflictException('Người dùng đã tồn tại');
    }

    const cart = await this.createCartForUser();
    const role = await this.roleService.findOneByText('user', true);

    // generate salt and hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    signUpDto.password = hashedPassword;

    // create customer
    const stripeCustomer = await this.stripeService.createCustomer(
      signUpDto.username,
      signUpDto.email,
    );

    // create and save username, password, email.
    const userSaved: User = await this.usersRepository.save({
      ...signUpDto,
      role,
      cart,
      stripeCustomerId: stripeCustomer.id,
    });

    delete userSaved.password;
    const accessToken = this.signToken(userSaved);
    return { accessToken };
  }

  async signin(signInDto: SignInDto) {
    const { password, email } = signInDto;
    const userByEmail: User = await this.getUserByEmail(email);

    const match = bcrypt.compareSync(password, userByEmail.password);
    if (!match) throw new UnauthorizedException('Mật khẩu không dúng');

    userByEmail.is_active = true;
    const userUpdated: User = await this.usersRepository.save(userByEmail);

    delete userUpdated.password;
    const accessToken = this.signToken(userUpdated);
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

    delete userUpdated.password;
    return userUpdated;
  }

  async validateUser(email: string): Promise<User> {
    const userByEmail: User = await this.getUserByEmail(email);

    delete userByEmail.password;

    return userByEmail;
  }

  async createResDataFacebookLogin(user: SignInFbDto) {
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
      userSaved = await this.usersRepository.save({
        email,
        username: user.id,
        password: null,
        avatar: user?.picture,
        full_name: user.displayName,
        user_facebook_id: user.id,
        auth_type: user.provider,
        role,
        cart,
        stripeCustomerId: stripeCustomer.id,
        is_active: true,
      });
    } else {
      userByEmailAndAuthType.is_active = true;
      userSaved = await this.usersRepository.save(userByEmailAndAuthType);
    }

    delete userSaved.password;
    const accessToken = this.signToken(userSaved);
    return { accessToken };
  }

  async createResDataGoogleLogin(user: SignInFbDto) {
    if (!user) {
      throw new BadRequestException('Không tìm thấy thông tin người dùng');
    }

    let userSaved: User;

    const email = user?.email;
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
      userSaved = await this.usersRepository.save({
        email,
        username: user.id,
        avatar: user.picture,
        full_name: user.displayName,
        password: null,
        user_google_id: user.id,
        auth_type: user.provider,
        role,
        cart,
        stripeCustomerId: stripeCustomer.id,
        is_active: true,
      });
    } else {
      userByEmailAndAuthType.is_active = true;
      userSaved = await this.usersRepository.save(userByEmailAndAuthType);
    }
    delete userSaved.password;
    const accessToken = this.signToken(userSaved);
    return { accessToken };
  }

  async createCartForUser(): Promise<Cart> {
    const createCartDto: CreateCartDto = { accept_guaratee_policy: false };
    return await this.cartsService.create(createCartDto);
  }
}
