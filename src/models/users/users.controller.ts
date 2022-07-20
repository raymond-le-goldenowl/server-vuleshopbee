import {
  Get,
  Post,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserDecorator } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/authentication/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UsersService } from './users.service';
import { config } from './file-interceptor.config';
import { User } from './entities/user.entity';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @Roles(Role.Admin, Role.User)
  async getProfile(@GetCurrentUserDecorator() user: User) {
    // remove properties not use
    return this.usersService.removePrivateUserData(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile/image')
  @Roles(Role.Admin, Role.User)
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  updateImage(@UploadedFile() image, @GetCurrentUserDecorator() user: User) {
    return this.usersService.updateImage(user, image);
  }
}
