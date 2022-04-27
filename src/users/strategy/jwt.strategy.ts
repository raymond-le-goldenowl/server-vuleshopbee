import { UsersService } from './../users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '../constants';

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
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUserByEmailAndAuthType(
      payload.email,
      payload.provider,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.is_active) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
