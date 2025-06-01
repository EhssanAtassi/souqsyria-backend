/**
 * @file membership.entity.ts
 * @description Entity representing Membership plans available for vendors.
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Example: Basic, Premium, Platinum

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Price for the membership plan

  @Column({ name: 'duration_in_days' })
  durationInDays: number; // Validity of the plan (e.g., 30, 365)

  @Column({ name: 'max_products', nullable: true })
  maxProducts: number; // Limit for number of products

  @Column({ name: 'max_images_per_product', nullable: true })
  maxImagesPerProduct: number; // Limit number of images allowed per product

  @Column({ name: 'priority_support', default: false })
  prioritySupport: boolean; // Whether the vendor gets priority support

  @Column({
    name: 'commission_discount',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  commissionDiscount: number; // Optional: Discount in selling commission %

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
