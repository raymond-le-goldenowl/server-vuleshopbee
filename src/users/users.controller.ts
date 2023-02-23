import {
  Get,
  Res,
  Post,
  Body,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from './enums/role.enum';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { config } from './file-interceptor.config';
import { Roles } from './decorators/roles.decorator';
import { GetCurrentUserDecorator } from './decorators/get-user.decorator';
import { SignInFbDto } from './dto/sigin-fb.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signupLocal(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @Post('/signin')
  signinLocal(@Body() signInDto: SignInDto) {
    return this.usersService.signin(signInDto);
  }

  @Post('/facebook')
  // @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Body() signInFbDto: SignInFbDto): Promise<any> {
    return this.usersService.createResDataFacebookLogin(signInFbDto);
  }

  @Post('/google')
  // @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Body() signInFbDto: SignInFbDto): Promise<any> {
    return this.usersService.createResDataGoogleLogin(signInFbDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @Roles(Role.Admin, Role.User)
  logout(@GetCurrentUserDecorator() user) {
    return this.usersService.logout(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @Roles(Role.Admin, Role.User)
  getProfile(@GetCurrentUserDecorator() user) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile/image')
  @Roles(Role.Admin, Role.User)
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  updateImage(@UploadedFile() image, @GetCurrentUserDecorator() user) {
    return this.usersService.updateImage(user, image);
  }

  @Get('/image/avatar/:imageName')
  getUserAvatar(
    @Res() res,
    @Param('imageName') imageName: string,
  ): Observable<any> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/avatars/' + imageName)),
    );
  }
}
