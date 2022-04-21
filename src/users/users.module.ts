import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jwtConstants } from './constants';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { RolesModule } from 'src/roles/roles.module';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    RolesModule,
    CartsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    FacebookStrategy,
    GoogleStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
