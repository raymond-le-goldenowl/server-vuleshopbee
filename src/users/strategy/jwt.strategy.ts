import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { jwtConstants } from '../constants';
import { UsersService } from './../users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    if (!payload?.email) {
      throw new UnauthorizedException('Không thể xác thực token');
    }

    const user = await this.usersService.getUserByEmailAndAuthType(
      payload.email,
      payload.provider,
    );

    if (!user) {
      throw new UnauthorizedException('Không thể tìm thấy người dùng');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Người dùng chưa đăng nhập');
    }

    return user;
  }
}
