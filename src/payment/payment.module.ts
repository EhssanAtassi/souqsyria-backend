import { forwardRef, Module } from '@nestjs/common';

import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { RefundTransaction } from '../refund/entities/refund-transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { AccessControlModule } from '../access-control/access-control.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { RefundModule } from '../refund/refund.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentTransaction,
      Order,
      User,
      RefundTransaction,

      // Wallet, WalletTransaction (if supporting wallet payments)
    ]),
    forwardRef(() => OrdersModule),
    UsersModule,
    AccessControlModule,
    forwardRef(() => RefundModule),
    // WalletModule, NotificationModule (optional for phase 1)
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
