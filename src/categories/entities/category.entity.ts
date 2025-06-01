/**
 * @file category.entity.ts
 * @description Entity for Product Categories with multilingual support and nested structure.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // Parent/Child Hierarchy
  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
  @Column({ default: false })
  isFeatured: boolean; // For homepage/featured categories
  // Multilingual Support
  @Column()
  nameEn: string;

  @Column()
  nameAr: string;

  @Column({ nullable: true })
  descriptionEn: string;

  @Column({ nullable: true })
  descriptionAr: string;

  @Column({ unique: true })
  slug: string;
  //SEO Fields
  @Column({ nullable: true })
  seoTitle: string;

  @Column({ nullable: true })
  seoDescription: string;

  @Column({ nullable: true })
  seoSlug: string;
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  bannerUrl: string; // ✅ New field for banner or icon image
  @Column({ nullable: true })
  iconUrl: string; // For category small icons
  @Column({ default: 0 })
  sortOrder: number; // ✅ New field for manual sorting priority
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // Soft delete for enterprise readiness
}
