/**
 * ------------------------------------------------------------
 * DashboardModule
 * ------------------------------------------------------------
 * This module provides metrics and analytics for both Admins
 * and Vendors in the SouqSyria platform.
 *
 * It imports TypeORM repositories for all required entities
 * including orders, refunds, vendors, stock, and shipments.
 * It also wires up the DashboardController and DashboardService
 * to expose analytics endpoints to the REST API.
 */

import { Module } from '@nestjs/common';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './service/dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { RefundTransaction } from '../refund/entities/refund-transaction.entity';
import { ReturnRequest } from '../orders/entities/return-request.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { VendorEntity } from '../vendors/entities/vendor.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { StockAlertEntity } from '../stock/entities/stock-alert.entity';
import { CommissionsModule } from '../commissions/commissions.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      RefundTransaction,
      ReturnRequest,
      VendorEntity,
      ProductEntity,
      StockAlertEntity,
      Shipment,
      User,
      Route
    ]),
    CommissionsModule,
    AccessControlModule, // ✅ Added to provide RouteRepository to PermissionsGuard
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
