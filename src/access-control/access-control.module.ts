import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsService } from './permissions/permissions.service';
import { PermissionsController } from './permissions/permissions.controller';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { RolePermissionsService } from './role-permissions/role-permissions.service';
import { RolePermissionsController } from './role-permissions/role-permissions.controller';
import { Role } from '../roles/entities/role.entity';
import { Route } from './entities/route.entity';
import { RoutesService } from './routes/routes.service';
import { RoutesController } from './routes/routes.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      Role,
      RolePermission,
      ActivityLog,
      Route,
      // User,
    ]),
    UsersModule,
    forwardRef(() => RolesModule),
  ],
  controllers: [
    PermissionsController,
    RolePermissionsController,
    RoutesController,
  ],
  providers: [PermissionsService, RolePermissionsService, RoutesService],
  exports: [
    TypeOrmModule,
    PermissionsService,
    RolePermissionsService,
    RoutesService,
  ],
})
export class AccessControlModule {}
