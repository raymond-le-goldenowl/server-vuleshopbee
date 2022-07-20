import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/models/users/users.service';
import { User } from 'src/models/users/entities/user.entity';

import { Role } from '../../authentication/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.headers?.authorization) {
      throw new ForbiddenException('Can not access resource');
    }
    const token = request.headers.authorization.split(' ')[1];
    const user: User = await this.verifyTokenAndGetUser(token);
    if (!user) {
      // decode and check,
      // throw error if null
      const decodedToken = this.jwtService.decode(token) as User;
      if (!decodedToken) throw new UnauthorizedException('Unauthorized');

      // find user by id and check,
      // throw error if not found
      const userToUpdate = await this.usersService.getUserById(decodedToken.id);
      if (!userToUpdate) {
        throw new UnauthorizedException('Unauthorized');
      }

      // if user found, set is_active and save,
      // is_active tell is that user login or not.
      userToUpdate.is_active = false;
      await this.usersService.saveUser(userToUpdate);
      return false;
    }

    // throw error if user was not role
    if (!user?.role) {
      throw new ForbiddenException('User can not access resource with no role');
    }

    // if user has some role, return check
    const roleValue = user.role.value as Role;
    return requiredRoles.includes(roleValue);
  }

  // Create function to verify and get user.
  private async verifyTokenAndGetUser(token: string): Promise<User> {
    try {
      const jwtUserInfo = this.jwtService.verify(token);
      return await this.usersService.getUserById(jwtUserInfo.id);
    } catch (error) {
      return null;
    }
  }
}
