/**
 * @file kyc.module.ts
 * @description Module for handling vendor KYC document uploads and verification.
 */
import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycDocument } from './entites/kyc-document.entity';
import { AdminKycController } from './admin-kyc.controller';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity';
@Module({
  imports: [TypeOrmModule.forFeature([KycDocument, User, Route]), UsersModule],
  providers: [KycService],
  controllers: [KycController, AdminKycController],
  exports: [KycService],
})
export class KycModule {}
