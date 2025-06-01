/**
 * 🛒 CartItem Entity (Enhanced)
 *
 * Represents a product variant added to a user's cart.
 * Stores quantity, original price, optional discount, selected attributes,
 * and metadata like expiration and campaign source.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '../../products/variants/entities/product-variant.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => ProductVariant, { eager: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column({ type: 'int' })
  quantity: number;

  // 💰 Snapshot of original price when item was added
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_add: number;

  // 🏷️ Optional discounted price if part of promotion at the time
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_discounted: number;

  // 🎯 Attributes selected during add-to-cart (e.g., color, size)
  @Column({ type: 'json', nullable: true })
  selected_attributes: Record<string, any>;

  // 🛡️ Validity flag — auto-marked false if product/price changes
  @Column({ default: true })
  valid: boolean;

  // ⏰ Optional expiration (e.g., for limited offers, flash sales, sessions)
  @Column({ type: 'datetime', nullable: true })
  expires_at?: Date;

  // 📊 Optional campaign/tracking reference
  @Column({ type: 'varchar', length: 100, nullable: true })
  added_from_campaign?: string;
}
