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
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { trimSingleObjectValue } from 'src/utils/trim-single-object-value';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private roleService: RolesService,
  ) {}

  async getUserByEmail(email: string): Promise<User | any> {
    let userByEmail;

    if (!email) {
      throw new BadRequestException();
    }

    try {
      userByEmail = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new BadRequestException();
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
      throw new BadRequestException();
    }

    console.log(email, auth_type);
    try {
      userByEmailAndAuthType = await this.usersRepository.findOne({
        where: { email, auth_type },
      });
    } catch (error) {
      throw new BadRequestException();
    }

    if (!userByEmailAndAuthType) {
      return false;
    }

    console.log('userByEmailAndAuthType => ', userByEmailAndAuthType);
    return trimSingleObjectValue(userByEmailAndAuthType) as User;
  }

  signToken(payload: object) {
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
      throw new ConflictException('User already exists');
    }

    try {
      const role = await this.roleService.findOneByText('user', true);

      // generate salt and hash password
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      signUpDto.password = hashedPassword;

      // create and save username, password, email.
      userSaved = await this.usersRepository.save({
        ...signUpDto,
        role,
      });
    } catch (error) {
      throw new BadRequestException();
    }

    delete userSaved.password;
    const accessToken = this.signToken(userSaved);
    return { user: userSaved, accessToken };
  }

  async signin(signInDto: SignInDto) {
    let userUpdated: User;
    const { password, email } = signInDto;

    const userByEmail: User = await this.getUserByEmail(email);
    const match = bcrypt.compareSync(password, userByEmail.password);

    if (!match) {
      throw new UnauthorizedException();
    }

    try {
      userByEmail.is_active = true;
      userUpdated = await this.usersRepository.save(userByEmail);
    } catch (error) {
      throw new BadRequestException();
    }
    delete userUpdated.password;
    const accessToken = this.signToken(userUpdated);
    return { user: userUpdated, accessToken };
  }

  async logout(jwtUserData: any) {
    let userUpdated: User;
    if (!jwtUserData) {
      throw new ForbiddenException();
    }

    const user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    try {
      user.is_active = false;
      userUpdated = await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException();
    }

    if (!userUpdated) {
      throw new BadRequestException();
    }

    return { logout: true };
  }

  async profile(jwtUserData: any, profileDto: ProfileDto) {
    let userUpdated: User;
    if (!jwtUserData) {
      throw new ForbiddenException();
    }

    let user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    try {
      user.is_active = false;
      user = { ...user, ...profileDto };
      userUpdated = await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException();
    }

    if (!userUpdated) {
      throw new BadRequestException();
    }

    return { logout: true };
  }

  async updateImage(jwtUserData: any, image: any) {
    let userUpdated: User;
    if (!jwtUserData) {
      throw new ForbiddenException();
    }

    const user = await this.usersRepository.findOne({
      where: { id: jwtUserData.id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    try {
      user.avatar = image.filename;
      userUpdated = await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException();
    }

    if (!userUpdated) {
      throw new BadRequestException();
    }
    delete userUpdated.password;
    return userUpdated;
  }

  async validateUser(email: string): Promise<User> {
    let userByEmail: User;

    try {
      userByEmail = await this.getUserByEmail(email);
    } catch (error) {
      throw new BadRequestException();
    }

    if (!userByEmail) {
      throw new NotFoundException();
    }

    delete userByEmail.password;

    return userByEmail;
  }

  async createResDataFacebookLogin(user: any) {
    if (!user) {
      throw new BadRequestException();
    }

    let userSaved: User;

    const email = user?.email;
    const userByEmailAndAuthType = await this.getUserByEmailAndAuthType(
      email,
      user?.provider,
    );

    if (!userByEmailAndAuthType) {
      try {
        const role = await this.roleService.findOneByText('user', true);
        // create and save username, password, email.
        userSaved = await this.usersRepository.save({
          email,
          username: user.id,
          password: null,
          avatar: user.picture,
          full_name: user.displayName,
          user_facebook_id: user.id,
          auth_type: user.provider,
          role,
        });

        delete userSaved.password;
        const accessToken = this.signToken(userSaved);
        return { user: userSaved, accessToken };
      } catch (error) {
        throw new BadRequestException();
      }
    }

    delete userByEmailAndAuthType.password;
    const accessToken = this.signToken(userByEmailAndAuthType);
    return { user: userByEmailAndAuthType, accessToken };
  }

  async createResDataGoogleLogin(user: any) {
    if (!user) {
      throw new BadRequestException();
    }

    console.log(user);
    let userSaved: User;

    const email = user?.email;
    const userByEmailAndAuthType = await this.getUserByEmailAndAuthType(
      email,
      user?.provider,
    );

    if (!userByEmailAndAuthType) {
      try {
        const role = await this.roleService.findOneByText('user', true);
        // create and save username, password, email.
        console.log({
          email,
          username: user.id,
          password: null,
          avatar: user.picture,
          full_name: user.displayName,
          user_google_id: user.id,
          auth_type: user.provider,
          role,
        });
        userSaved = await this.usersRepository.save({
          email,
          username: user.id,
          password: null,
          user_google_id: user.id,
          auth_type: user.provider,
          role,
        });

        delete userSaved.password;
        const accessToken = this.signToken(userSaved);
        return { user: userSaved, accessToken };
      } catch (error) {
        console.log(error);
        throw new BadRequestException();
      }
    }

    delete userByEmailAndAuthType.password;
    const accessToken = this.signToken(userByEmailAndAuthType);
    return { user: userByEmailAndAuthType, accessToken };
  }
}
