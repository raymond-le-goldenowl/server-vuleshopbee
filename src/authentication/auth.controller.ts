import { Post, Body, UseGuards, Controller } from '@nestjs/common';

import { Role } from './enums/role.enum';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetCurrentUserDecorator } from '../common/decorators/get-user.decorator';
import { SignInWithSocialDto } from './dto/sigin-social.dto';
import { User } from 'src/models/users/entities/user.entity';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  @Post('/signup')
  signupLocal(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @Post('/signin')
  signinLocal(@Body() signInDto: SignInDto) {
    return this.usersService.signin(signInDto);
  }

  @Post('/facebook')
  async facebookLoginRedirect(
    @Body() signInFbDto: SignInWithSocialDto,
  ): Promise<any> {
    return this.usersService.signUpWithSocialMedia(signInFbDto);
  }

  @Post('/google')
  async googleLoginRedirect(
    @Body() signInFbDto: SignInWithSocialDto,
  ): Promise<any> {
    return this.usersService.signUpWithSocialMedia(signInFbDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @Roles(Role.Admin, Role.User)
  logout(@GetCurrentUserDecorator() user: User) {
    return this.usersService.logout(user);
  }
}
