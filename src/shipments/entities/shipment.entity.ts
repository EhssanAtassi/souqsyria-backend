/**
 * 🚚 Shipment Entity
 *
 * Represents a delivery assignment. May include one or more order items.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ShippingCompany } from './shipping-company.entity';
import { ShipmentStatusLog } from './shipment-status-log.entity';
import { ShipmentItem } from './shipment-item.entity';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ShippingCompany)
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: ShippingCompany;

  @OneToMany(() => ShipmentItem, (item) => item.shipment, { cascade: true })
  items: ShipmentItem[];

  @Column({ type: 'varchar', length: 30 })
  status: string;
// --- 🟢 NEW: Assigned delivery agent (nullable) ---
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'delivery_agent_id' })
  deliveryAgent?: User;
  @Column({ type: 'varchar', length: 50, nullable: true })
  tracking_code?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  proof_type?: 'signature' | 'photo' | 'otp';

  @Column({ type: 'text', nullable: true })
  proof_data?: string;

  @Column({ type: 'timestamp', nullable: true })
  estimated_delivery_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
