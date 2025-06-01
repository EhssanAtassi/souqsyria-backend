import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * AuditLog entity captures all administrative or user actions
 * that must be recorded for traceability, compliance, or debugging.
 */
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // e.g. 'product.update', 'payment.refund'

  @Column({ nullable: true })
  module?: string; // e.g. 'products', 'orders'

  @Column()
  actorId: number; // ID of the user / admin / vendor who performed the action

  @Column()
  actorType: 'admin' | 'vendor' | 'user';

  @Column({ type: 'json', nullable: true })
  meta?: Record<string, any>; // Optional metadata like productId, oldValues, newValues, etc.

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;
}