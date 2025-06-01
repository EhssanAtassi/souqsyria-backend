/**
 * @file role-permissions.service.ts
 * @description Service for managing role-permissions mappings dynamically.
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateRolePermissionDto } from '../dto/role-permission/create-role-permission.dto';
import { ActivityLog } from '../entities/activity-log.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolePermissionsService {
  private readonly logger = new Logger(RolePermissionsService.name);

  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async assignPermissionToRole(
    createRolePermissionDto: CreateRolePermissionDto,
    adminUser: User,
  ): Promise<RolePermission> {
    const { roleId, permissionId } = createRolePermissionDto;

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    const rolePermission = this.rolePermissionRepository.create({
      role,
      permission,
    });
    const saved = await this.rolePermissionRepository.save(rolePermission);

    await this.activityLogRepository.save({
      user: adminUser,
      action: 'ASSIGN_PERMISSION_TO_ROLE',
      targetTable: 'role_permissions',
      targetId: saved.id,
      description: `Permission ${permission.name} assigned to role ${role.name}`,
    });

    this.logger.log(
      `Permission ${permission.name} assigned to Role ${role.name}`,
    );
    return saved;
  }

  async listRolePermissions(roleId: number): Promise<Permission[]> {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { id: roleId } },
      relations: ['permission'],
    });

    return rolePermissions.map((rp) => rp.permission);
  }

  async removeRolePermission(id: number, adminUser: User): Promise<void> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { id },
    });
    if (!rolePermission)
      throw new NotFoundException('Role-Permission mapping not found');

    await this.rolePermissionRepository.remove(rolePermission);

    await this.activityLogRepository.save({
      user: adminUser,
      action: 'REMOVE_ROLE_PERMISSION',
      targetTable: 'role_permissions',
      targetId: rolePermission.id,
      description: `RolePermission ${rolePermission.id} removed`,
    });

    this.logger.log(`RolePermission removed: ID ${rolePermission.id}`);
  }
}
