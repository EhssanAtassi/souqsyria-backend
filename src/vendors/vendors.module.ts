import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendor.entity';
import { VendorMembershipEntity } from './entities/vendor-membership.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorEntity,
      VendorMembershipEntity,
      Membership,
    ]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [TypeOrmModule],
})
export class VendorsModule {}
