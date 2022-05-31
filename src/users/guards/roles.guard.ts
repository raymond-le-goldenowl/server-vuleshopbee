import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { User } from '../entities/user.entity';

import { UsersRepository } from '../users.repository';

import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
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
      throw new ForbiddenException('Không thể xác thực');
    }
    const token = request.headers.authorization.split(' ')[1];

    let user: User;

    try {
      const jwtUserInfo = this.jwtService.verify(token);
      user = await this.usersRepository.findOne({
        relations: ['cart', 'role'],
        where: {
          id: jwtUserInfo.id,
        },
      });
    } catch (error) {
      const decodedToken = this.jwtService.decode(token) as User;
      if (!decodedToken) throw new UnauthorizedException('Lỗi xác thực token');

      const userToUpdate = await this.usersRepository.findOne(decodedToken.id);

      if (!userToUpdate) {
        throw new NotFoundException('Không thể xác thực người dùng');
      }

      userToUpdate.is_active = false;
      await this.usersRepository.save(userToUpdate);

      throw new BadRequestException(error.message);
    }

    if (!user?.role) {
      throw new BadRequestException('Chưa có vai trò người dùng');
    }

    const roleValue = user.role.value as Role;
    return requiredRoles.includes(roleValue);
  }
}
