/**
 * @file app.module.ts
 * @description Main entry point of SouqSyria backend. Sets up global modules, TypeORM, and security guards.
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { KycModule } from './kyc/kyc.module';

import { APP_GUARD } from '@nestjs/core'; // ✅ Import NestJS Core
import { RolesGuard } from './common/guards/roles.guards'; // ✅ Import our custom RolesGuard
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { AccessControlModule } from './access-control/access-control.module';
import { StaffManagementModule } from './staff-management/staff-management.module';
import { ProductsModule } from './products/products.module';
import { VendorsModule } from './vendors/vendors.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
// import { ManufacturersService } from './manufacturers.service';
import { StockModule } from './stock/stock.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { AttributesModule } from './attributes/attributes.module';
import { FeaturesModule } from './features/features.module';

import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CommissionsModule } from './commissions/commissions.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentModule } from './payment/payment.module';
import { RefundModule } from './refund/refund.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { GuardsModule } from './common/guards/guards.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProductionLoggerService } from './common/services/logger.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    RolesModule,
    KycModule,
    CategoriesModule,
    BrandsModule,
    AccessControlModule,
    StaffManagementModule,
    ProductsModule,
    VendorsModule,
    MembershipsModule,
    ManufacturersModule,
    StockModule,
    WarehousesModule,
    AttributesModule,
    FeaturesModule,
    CartModule,
    OrdersModule,
    CommissionsModule,
    ShipmentsModule,
    DashboardModule,
    WishlistModule,
    AddressesModule,
    PaymentModule,
    RefundModule,
    AuditLogModule,
    GuardsModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ProductionLoggerService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
