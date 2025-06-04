import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Route, User])],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [TypeOrmModule],
})
export class MembershipsModule {}
