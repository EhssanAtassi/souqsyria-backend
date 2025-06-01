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
@Module({
  imports: [TypeOrmModule.forFeature([KycDocument]), UsersModule],
  providers: [KycService],
  controllers: [KycController, AdminKycController],
  exports: [KycService],
})
export class KycModule {}
