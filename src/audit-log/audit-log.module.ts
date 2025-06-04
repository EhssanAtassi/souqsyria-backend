import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogService } from './service/audit-log.service';
import { AuditLogController } from './controller/audit-log.controller';
import { AuditLog } from './entities/audit-log.entity';
import { AccessControlModule } from '../access-control/access-control.module';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, User, Route]),
    AccessControlModule,
  ],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
