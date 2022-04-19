import {
  Get,
  Res,
  Req,
  Post,
  Body,
  UseGuards,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from './enums/role.enum';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ProfileDto } from './dto/profile.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { config } from './file-interceptor.config';
import { Roles } from './decorators/roles.decorator';
import { GetCurrentUserDecorator } from './decorators/get-user.decorator';

@Controller('users')
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

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req): Promise<any> {
    return this.usersService.createResDataFacebookLogin(req?.user);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req): Promise<any> {
    return this.usersService.createResDataGoogleLogin(req?.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @Roles(Role.Admin, Role.User)
  logout(@GetCurrentUserDecorator() user) {
    return this.usersService.logout(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  @Roles(Role.Admin, Role.User)
  profile(@GetCurrentUserDecorator() user, @Body() profileDto: ProfileDto) {
    return this.usersService.profile(user, profileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile/image')
  @Roles(Role.Admin, Role.User)
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  updateImage(@UploadedFile() image, @GetCurrentUserDecorator() user) {
    return this.usersService.updateImage(user, image);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/image/avatar')
  @Roles(Role.Admin, Role.User)
  getUserAvatar(@Res() res, @GetCurrentUserDecorator() user): Observable<any> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/avatars/' + user.avatar)),
    );
  }

  // Test Role and JwtAuthGuard
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  @Roles(Role.Admin, Role.User)
  test(@GetCurrentUserDecorator() _user) {
    return 'test';
  }
}
