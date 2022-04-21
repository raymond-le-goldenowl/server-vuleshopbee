import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UsersRepository } from '../users.repository';

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
      throw new ForbiddenException();
    }
    const token = request.headers.authorization.split(' ')[1];

    let user: User;

    try {
      user = this.jwtService.verify(token);
    } catch (error) {
      const decodedToken = this.jwtService.decode(token) as User;
      if (!decodedToken) throw new BadRequestException();

      const userToUpdate = await this.usersRepository.findOne(decodedToken.id);
      userToUpdate.is_active = false;
      await this.usersRepository.save(userToUpdate);

      throw new BadRequestException(error.message);
    }

    if (!user?.role) throw new BadRequestException('No role');

    const roleValue = user.role.value as Role;
    return requiredRoles.includes(roleValue);
  }
}
