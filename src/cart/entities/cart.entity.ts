/**
 * @file cart.entity.ts
 * @description Enhanced Cart Entity for SouqSyria E-commerce Platform
 *
 * FEATURES:
 * - Single shopping cart per user with session management
 * - Optimistic locking for concurrent cart operations
 * - Multi-currency support for Syrian market (SYP, USD, EUR, TRY)
 * - Cart status tracking (active, abandoned, converting, expired)
 * - Performance optimization with cached totals
 * - Activity tracking for abandonment detection
 *
 * @author SouqSyria Development Team
 * @since 2025-07-02
 * @version 2.0.0
 */

import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from './cart-item.entity';

/**
 * Cart Entity - Represents a shopping cart for SouqSyria customers
 */
@Entity('carts')
export class Cart {
  /**
   * Primary key - Auto-incrementing cart identifier
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Cart owner - User who owns this shopping cart
   */
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * User ID - Foreign key reference for performance
   */
  @Column({ name: 'user_id', type: 'int' })
  @Index()
  userId: number;

  /**
   * Cart Items - Collection of products in the cart
   */
  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: false,
  })
  items: CartItem[];

  /**
   * Optimistic Locking Version - Prevents concurrent modification conflicts
   */
  @VersionColumn()
  version: number;

  /**
   * Cart Status - Current lifecycle state of the cart
   */
  @Column({
    type: 'enum',
    enum: ['active', 'abandoned', 'converting', 'expired'],
    default: 'active',
  })
  @Index()
  status: 'active' | 'abandoned' | 'converting' | 'expired';

  /**
   * Currency Code - Currency for all prices in this cart
   */
  @Column({
    type: 'varchar',
    length: 3,
    default: 'SYP',
  })
  @Index()
  currency: string;

  /**
   * Total Items Count - Cached count of all items in cart
   */
  @Column({
    name: 'total_items',
    type: 'int',
    default: 0,
  })
  totalItems: number;

  /**
   * Total Amount - Cached final cart total including taxes and shipping
   */
  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  /**
   * Last Activity Timestamp - When cart was last modified
   */
  @Column({
    name: 'last_activity_at',
    type: 'datetime',
    nullable: true,
  })
  @Index()
  lastActivityAt?: Date;

  /**
   * Cart Expiration Timestamp - When cart automatically expires
   */
  @Column({
    name: 'expires_at',
    type: 'datetime',
    nullable: true,
  })
  @Index()
  expiresAt?: Date;

  /**
   * Creation Timestamp - When cart was first created
   */
  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  /**
   * Last Update Timestamp - When cart was last modified
   */
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;

  /**
   * Before Update Hook - Automatically update activity timestamp
   */
  @BeforeUpdate()
  updateActivityTimestamp(): void {
    this.lastActivityAt = new Date();
  }

  /**
   * Check if cart has expired based on expiration timestamp
   */
  isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  /**
   * Check if cart is considered abandoned (inactive > 24 hours)
   */
  isAbandoned(): boolean {
    if (!this.lastActivityAt) return false;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.lastActivityAt < twentyFourHoursAgo;
  }

  /**
   * Get cart summary for API responses and quick access
   */
  getSummary() {
    return {
      id: this.id,
      userId: this.userId,
      totalItems: this.totalItems,
      totalAmount: this.totalAmount,
      currency: this.currency,
      status: this.status,
      isExpired: this.isExpired(),
      isAbandoned: this.isAbandoned(),
      lastActivity: this.lastActivityAt,
      createdAt: this.created_at,
      version: this.version,
    };
  }
}
