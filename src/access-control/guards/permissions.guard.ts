/**
 * @file permissions.guard.ts
 * @description Guard that dynamically checks permissions based on route table at runtime.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../entities/route.entity';
import { User } from '../../users/entities/user.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.assignedRole || !user.assignedRole.rolePermissions) {
      throw new ForbiddenException(
        'Access denied. User role or permissions not set.',
      );
    }

    const requestPath = request.route?.path || request.url; // fallback if route not resolved
    const requestMethod = request.method;

    // Try to find the route in DB
    const route = await this.routeRepository.findOne({
      where: { path: requestPath, method: requestMethod },
      relations: ['permission'],
    });

    if (!route) {
      // No permission assigned to this route = public route
      return true;
    }

    if (!route.permission) {
      // Route exists but no specific permission linked = public route
      return true;
    }

    // Collect user's permissions
    const rolePermissions = user.assignedRole
      .rolePermissions as RolePermission[];
    const userPermissionNames = rolePermissions.map((rp) => rp.permission.name);

    const requiredPermission = route.permission.name;

    const hasPermission = userPermissionNames.includes(requiredPermission);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Missing permission: ${requiredPermission}`,
      );
    }

    return true;
  }
}
