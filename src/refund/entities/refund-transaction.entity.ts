/**
 * 💵 RefundTransactionEntity
 *
 * Tracks any approved refunds linked to orders.
 * Supports internal tracking and external gateway integration.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentTransaction } from '../../payment/entities/payment-transaction.entity';

@Entity('refund_transactions')
export class RefundTransaction {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => PaymentTransaction, (payment) => payment.refunds, { nullable: false })
  @JoinColumn({ name: 'payment_transaction_id' })
  paymentTransaction: PaymentTransaction;
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'processed_by' })
  processedBy: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  method: 'wallet' | 'manual' | 'card';

  @Column({ type: 'varchar', length: 20, default: 'processed' })
  status: 'processed' | 'failed';

  @Column({ type: 'text', nullable: true })
  notes: string;


  @CreateDateColumn()
  created_at: Date;
  @CreateDateColumn()
  updated_at: Date;
}
