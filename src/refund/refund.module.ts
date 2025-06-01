import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefundService } from './services/refund.service';
import { RefundController } from './controllers/refund.controller';
import { RefundTransaction } from './entities/refund-transaction.entity';

import { OrdersModule } from '../orders/orders.module';
import { PaymentModule } from '../payment/payment.module';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundTransaction]),
    AccessControlModule,
    // Import external modules used by RefundService
    // forwardRef(() => OrdersModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => PaymentModule),
  ],
  providers: [RefundService],
  controllers: [RefundController],
  exports: [RefundService, TypeOrmModule], // Optional: only if other modules need it
})
export class RefundModule {}
