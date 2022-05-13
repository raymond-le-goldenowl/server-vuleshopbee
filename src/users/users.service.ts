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
import { UsersRepository } from './users.repository';

import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { User } from './entities/user.entity';
import { ProfileDto } from './dto/profile.dto';
import { RolesService } from 'src/roles/roles.service';
import { trimSingleObjectValue } from 'src/utils/trim-single-object-value';
import { CartsService } from 'src/carts/carts.service';
import { CreateCartDto } from 'src/carts/dto/create-cart.dto';
import { Cart } from 'src/carts/entities/cart.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { SignInFbDto } from './dto/sigin-fb.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private roleService: RolesService,
    private cartsService: CartsService,
    private stripeService: StripeService,
  ) {}

  async getUserByEmail(email: string): Promise<User | any> {
    let userByEmail;

    if (!email) {
      throw new BadRequestException('Không có email');
    }

    try {
      userByEmail = await this.usersRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw error;
    }

    if (!userByEmail) {
      return false;
    }

    return trimSingleObjectValue(userByEmail) as User;
  }

  async getUserByEmailAndAuthType(
    email: string,
    auth_type: string,
  ): Promise<User | any> {
    let userByEmailAndAuthType;

    if (!email) {
      throw new BadRequestException('Không có email');
    }

    try {
      userByEmailAndAuthType = await this.usersRepository.findOne({
        where: { email, auth_type },
      });
    } catch (error) {
      throw error;
    }

    if (!userByEmailAndAuthType) {
      return false;
    }

    return trimSingleObjectValue(userByEmailAndAuthType) as User;
  }

  signToken(user: User) {
    if (!user) throw new BadRequestException('Không tìm thấy người dùng');
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
    let userSaved: User;
    const { password, email } = signUpDto;

    const user = await this.getUserByEmail(email);

    if (user) {
      throw new ConflictException('Người dùng đã tồn tại');
    }

    try {
      const cart = await this.createCartForUser();
      const role = await this.roleService.findOneByText('user', true);
      if (!role)
        throw new NotFoundException('Vai trò người dùng không khả dụng');

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
      userSaved = await this.usersRepository.save({
        ...signUpDto,
        role,
        cart,
        stripeCustomerId: stripeCustomer.id,
      });
    } catch (error) {
      throw error;
    }

    delete userSaved.password;
    const accessToken = this.signToken(userSaved);
    return { user: userSaved, accessToken };

    // const newUser = await this.usersRepository.create({
    //   ...userData,
    //   stripeCustomerId: stripeCustomer.id,
    // });
    // await this.usersRepository.save(newUser);
    // return newUser;
  }

  async signin(signInDto: SignInDto) {
    let userUpdated: User;
    const { password, email } = signInDto;

    try {
      const userByEmail: User = await this.getUserByEmail(email);
      if (!userByEmail)
        throw new UnauthorizedException(
          'Không tìm thấy người dùng với email = ' + email,
        );

      const match = bcrypt.compareSync(password, userByEmail.password);
      if (!match) throw new UnauthorizedException('Mật khẩu không dúng');

      userByEmail.is_active = true;
      userUpdated = await this.usersRepository.save(userByEmail);
    } catch (error) {
      throw error;
    }
    delete userUpdated.password;
    const accessToken = this.signToken(userUpdated);
    return { user: userUpdated, accessToken };
  }

  async logout(jwtUserData: any) {
    let userUpdated: User;
    if (!jwtUserData) {
      throw new ForbiddenException('Không tìm thấy người dùng');
    }

    const user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    try {
      user.is_active = false;
      userUpdated = await this.usersRepository.save(user);
    } catch (error) {
      throw error;
    }

    if (!userUpdated) {
      throw new BadRequestException('Không thể cập nhập thông tin người dùng');
    }

    return { logout: true };
  }

  async profile(jwtUserData: any, profileDto: ProfileDto) {
    let userUpdated: User;
    if (!jwtUserData) {
      throw new ForbiddenException('Không tìm thấy thông tin người dùng');
    }

    let user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    try {
      user.is_active = false;
      user = { ...user, ...profileDto };
      userUpdated = await this.usersRepository.save(user);
    } catch (error) {
      throw error;
    }

    if (!userUpdated) {
      throw new BadRequestException('Không thể cập nhập người dùng');
    }

    return { logout: true };
  }

  async updateImage(jwtUserData: any, image: any) {
    let userUpdated: User;
    if (!jwtUserData) {
      throw new ForbiddenException('Không tìm thấy người dùng');
    }

    const user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    try {
      user.avatar = image.filename;
      userUpdated = await this.usersRepository.save(user);
    } catch (error) {
      throw error;
    }

    if (!userUpdated) {
      throw new BadRequestException('Không thể cập nhập người dùng');
    }
    delete userUpdated.password;
    return userUpdated;
  }

  async validateUser(email: string): Promise<User> {
    let userByEmail: User;

    try {
      userByEmail = await this.getUserByEmail(email);
    } catch (error) {
      throw error;
    }

    if (!userByEmail) {
      throw new NotFoundException(
        'Không tìm thấy người dùng với email=' + email,
      );
    }

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
      try {
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
        });

        delete userSaved.password;
        const accessToken = this.signToken(userSaved);
        return { user: userSaved, accessToken };
      } catch (error) {
        throw error;
      }
    }

    delete userByEmailAndAuthType.password;
    const accessToken = this.signToken(userByEmailAndAuthType);
    return { user: userByEmailAndAuthType, accessToken };
  }

  async createResDataGoogleLogin(user: SignInFbDto) {
    if (!user) {
      throw new BadRequestException('Không tìm thấy thông tin người dùng');
    }

    let userSaved: User;

    const email = user?.email;
    const userByEmailAndAuthType = await this.getUserByEmailAndAuthType(
      email,
      user?.provider,
    );

    if (!userByEmailAndAuthType) {
      try {
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
        });

        delete userSaved.password;
        const accessToken = this.signToken(userSaved);
        return { user: userSaved, accessToken };
      } catch (error) {
        throw error;
      }
    }

    delete userByEmailAndAuthType.password;
    const accessToken = this.signToken(userByEmailAndAuthType);
    return { user: userByEmailAndAuthType, accessToken };
  }

  async createCartForUser(): Promise<Cart> {
    let cart: Cart;
    try {
      const createCartDto: CreateCartDto = { accept_guaratee_policy: false };
      cart = await this.cartsService.create(createCartDto);
    } catch (error) {
      throw error;
    }

    if (!cart) throw new BadRequestException('Không thể tạo giỏ hàng');

    return cart;
  }
}
