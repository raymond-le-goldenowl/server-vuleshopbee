import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository) private rolesRepository: RolesRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    let role: Role, roleSaved: Role;

    try {
      role = await this.rolesRepository.create(createRoleDto);

      roleSaved = await this.rolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException();
    }

    if (!roleSaved) {
      throw new BadRequestException();
    }

    return roleSaved;
  }

  async findAll(withDeleted: boolean): Promise<Role[]> {
    let roles: Role[];
    try {
      if (withDeleted) {
        roles = await this.rolesRepository.find({ withDeleted: true });
      } else {
        roles = await this.rolesRepository.find();
      }
    } catch (error) {
      throw new BadRequestException();
    }

    return roles;
  }

  async findOne(id: string, withDeleted: boolean): Promise<Role> {
    let role: Role;
    try {
      if (withDeleted) {
        role = await this.rolesRepository.findOne({
          where: { id },
          withDeleted: true,
        });
      } else {
        role = await this.rolesRepository.findOne({ where: { id } });
      }
    } catch (error) {
      throw new BadRequestException();
    }

    return role;
  }

  async findOneByText(text: string, withDeleted: boolean): Promise<Role> {
    let role: Role;
    try {
      if (withDeleted) {
        role = await this.rolesRepository.findOne({
          where: { text },
          withDeleted: true,
        });
      } else {
        role = await this.rolesRepository.findOne({ where: { text } });
      }
    } catch (error) {
      throw new BadRequestException();
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    let role: Role = await this.findOne(id, true);
    let roleSaved: Role;
    try {
      role.deleted_at = null;
      role = { ...role, ...updateRoleDto };
      roleSaved = await this.rolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException();
    }

    return roleSaved;
  }

  async remove(id: string, remove: boolean) {
    try {
      if (remove) {
        await this.rolesRepository.delete(id);
      } else {
        await this.rolesRepository.softDelete(id);
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
