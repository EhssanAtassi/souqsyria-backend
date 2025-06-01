import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffManagementService } from './staff-management.service';
import { StaffManagementController } from './staff-management.controller';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { ActivityLog } from '../access-control/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, ActivityLog])],
  controllers: [StaffManagementController],
  providers: [StaffManagementService],
})
export class StaffManagementModule {}
