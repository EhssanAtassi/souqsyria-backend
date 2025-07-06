/**
 * @file product.entity.ts
 * @description Core Product Entity representing a product listing.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { VendorEntity } from '../../vendors/entities/vendor.entity';
import { ManufacturerEntity } from '../../manufacturers/entities/manufacturer.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductDescriptionEntity } from './product-description.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from '../variants/entities/product-variant.entity';
import { ProductFeatureEntity } from '../../features/entities/product-feature.entity';
import { ProductAttribute } from './product-attribute.entity/product-attribute.entity';
import { ProductPriceEntity } from '../pricing/entities/product-price.entity';
import { Brand } from '../../brands/entities/brand.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VendorEntity, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorEntity; // Null = Admin-owned product

  @ManyToOne(() => ManufacturerEntity, { nullable: true })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: ManufacturerEntity;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand?: Brand;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ unique: true })
  slug: string;

  @OneToOne(() => ProductPriceEntity, (price) => price.product)
  pricing: ProductPriceEntity;

  @Column({ type: 'enum', enum: ['SYP', 'TRY', 'USD'], default: 'SYP' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  weight: number;

  @Column({ nullable: true, type: 'json' })
  dimensions: { width: number; height: number; length: number };

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @OneToMany(
    () => ProductDescriptionEntity,
    (description) => description.product,
  )
  descriptions: ProductDescriptionEntity[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductFeatureEntity, (pf) => pf.product)
  features: ProductFeatureEntity[];

  /**
   * One product can have multiple attribute-value pairs
   * Example: Size = XL, Color = Red
   */
  @OneToMany(() => ProductAttribute, (attr) => attr.product, { cascade: true })
  attributes: ProductAttribute[];

  // @OneToMany(() => ProductStockEntity, (stock) => stock.product)
  // stocks: ProductStockEntity[];
  @Column({ default: false })
  is_deleted: boolean;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
