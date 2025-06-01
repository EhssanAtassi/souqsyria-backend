import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { StockModule } from '../../stock/stock.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductEntity } from '../entities/product.entity';
import { WarehousesModule } from '../../warehouses/warehouses.module';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { AccessControlModule } from '../../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariant, ProductEntity, Warehouse]),
    StockModule,
    WarehousesModule,
    AccessControlModule,
  ],
  providers: [VariantsService],
  controllers: [VariantsController],
  exports: [VariantsService, TypeOrmModule],
})
export class VariantsModule {}
