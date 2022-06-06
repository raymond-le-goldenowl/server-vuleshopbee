import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.rolesRepository.save(createRoleDto);
  }

  async findAll(withDeleted: boolean): Promise<Role[]> {
    return await this.rolesRepository.find({
      withDeleted: withDeleted,
    });
  }

  async findOne(id: string, withDeleted: boolean): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      withDeleted: withDeleted,
    });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy vai trò với id = ${id}`);
    }

    return role;
  }

  async findOneByText(text: string, withDeleted: boolean): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { text },
      withDeleted: withDeleted,
    });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy vai trò với text = ${text}`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    let role: Role = await this.findOne(id, true);
    role.deleted_at = null;
    role = { ...role, ...updateRoleDto };
    return await this.rolesRepository.save(role);
  }

  async remove(id: string, remove: boolean) {
    if (remove) {
      return await this.rolesRepository.delete(id);
    }
    return await this.rolesRepository.softDelete(id);
  }
}
