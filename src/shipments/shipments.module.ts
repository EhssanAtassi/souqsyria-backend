/**
 * 🧱 ShipmentsModule
 *
 * Manages all shipment-related logic including assignment, status tracking,
 * multi-vendor delivery, and internal/external shipping company coordination.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsService } from './service/shipments.service';
import { ShipmentsController } from './controller/shipments.controller';
import { User } from 'src/users/entities/user.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentItem } from './entities/shipment-item.entity';
import { ShippingCompany } from './entities/shipping-company.entity';
import { ShipmentStatusLog } from './entities/shipment-status-log.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { AccessControlModule } from '../access-control/access-control.module';
import { Route } from '../access-control/entities/route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipment,
      ShipmentItem,
      ShippingCompany,
      ShipmentStatusLog,
      Order,
      OrderItem,
      User,
      Route
    ]),
    AccessControlModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
