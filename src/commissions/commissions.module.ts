// src/commissions/commissions.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionsService } from './service/commissions.service';
import { CommissionsController } from './controller/commissions.controller';
// Entities used by the Commission system
import { ProductCommissionEntity } from './entites/product-commission.entity';
import { VendorCommissionEntity } from './entites/vendor-commission.entity';
import { CategoryCommissionEntity } from './entites/category-commission.entity';
import { GlobalCommissionEntity } from './entites/global-commission.entity';
import { MembershipDiscountEntity } from './entites/membership-discount.entity';
import { CommissionAuditLogEntity } from './entites/commission-audit-log.entity';
import { UsersModule } from '../users/users.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { OrderItem } from '../orders/entities/order-item.entity';
import { CommissionPayoutEntity } from './entites/commission-payout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCommissionEntity,
      VendorCommissionEntity,
      CategoryCommissionEntity,
      GlobalCommissionEntity,
      MembershipDiscountEntity,
      CommissionAuditLogEntity,
      CommissionPayoutEntity, // ✅ Added payout entity
      OrderItem, // ✅ Added to make OrderItemRepository available
    ]),
    UsersModule,
    AccessControlModule,
  ],
  providers: [CommissionsService],
  controllers: [CommissionsController],
  exports: [CommissionsService, TypeOrmModule],
})
export class CommissionsModule {}
