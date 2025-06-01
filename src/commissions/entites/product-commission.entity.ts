import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user.entity';
import { VendorEntity } from '../../vendor.entity';
import { ProductEntity } from '../../product.entity';
import { CategoryEntity } from '../../category.entity';

@Entity('product-commission')
export class ProductCommissionEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Primary key' })
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  @ApiProperty({ description: 'Commission percentage (e.g., 7.5)' })
  percentage: number;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty({ description: 'Start date for time-based commission (nullable)' })
  valid_from: Date;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty({ description: 'End date for time-based commission (nullable)' })
  valid_to: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Optional note explaining override reason' })
  note: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'created_by' })
  @ApiProperty({ description: 'Admin who created this rule' })
  createdBy: UserEntity;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;


  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  @ApiProperty({ description: 'Target product' })
  product: ProductEntity;

}