/**
 * @file brands.module.ts
 * @description Fixed Brands module with ALL required dependencies for PermissionsGuard
 *
 * ✅ FIXES:
 * - Added Route entity import for PermissionsGuard
 * - Added proper TypeORM feature registration
 * - Added GuardsModule import (since it's @Global, this helps with context)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity'; // ✅ Added for PermissionsGuard
import { AuditLogModule } from '../audit-log/audit-log.module';
import { GuardsModule } from '../common/guards/guards.module'; // ✅ Added for context

@Module({
  imports: [
    // ✅ Register ALL entities that PermissionsGuard needs
    TypeOrmModule.forFeature([Brand, User, Route]),

    // ✅ Import AuditLogModule for audit trail functionality
    AuditLogModule,

    // ✅ Import GuardsModule to ensure proper context
    GuardsModule,
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService, TypeOrmModule],
})
export class BrandsModule {}