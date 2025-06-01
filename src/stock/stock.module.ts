/**
 * @file stock.module.ts
 * @description Module for managing stock operations and tracking across warehouses.
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductStockEntity } from './entities/product-stock.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { AccessControlModule } from '../access-control/access-control.module';
import { ProductsModule } from '../products/products.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { ProductVariant } from '../products/variants/entities/product-variant.entity';
import { StockAlertEntity } from './entities/stock-alert.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductStockEntity,
      StockMovementEntity,
      ProductVariant,
      ProductEntity,
      StockAlertEntity,
      Warehouse,
    ]),
    AccessControlModule,
    forwardRef(() => ProductsModule),
    WarehousesModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService, TypeOrmModule],
})
export class StockModule {}
