/**
 * @file create-category.dto.ts
 * @description DTO for creating a new category with multilingual, icon/banner, hierarchy, SEO, and status fields.
 */
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'Category name in English',
  })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({
    example: 'إلكترونيات',
    description: 'Category name in Arabic',
  })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({
    example: 'electronics',
    description: 'Slug for SEO friendly URLs',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'Devices, gadgets, and home electronics',
    description: 'Category description in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiProperty({
    example: 'أجهزة وإلكترونيات منزلية',
    description: 'Category description in Arabic',
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiProperty({
    example: 'https://cdn.souqsyria.com/categories/electronics-icon.png',
    description: 'Optional Icon URL for category menu',
    required: false,
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({
    example: 'https://cdn.souqsyria.com/categories/electronics-banner.jpg',
    description: 'Optional Banner URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({
    example: 1,
    description: 'Optional parent category ID (for hierarchy)',
    required: false,
  })
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    example: 0,
    description: 'Optional sort order',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    example: true,
    description: 'Is the category active?',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    example: false,
    description: 'Is the category featured on homepage?',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiProperty({
    example: 'Buy electronics online at best price',
    description: 'SEO Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({
    example: 'Shop electronics, mobile phones, TVs, and more with fast delivery',
    description: 'SEO Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({
    example: 'best-electronics-syria',
    description: 'SEO Slug',
    required: false,
  })
  @IsOptional()
  @IsString()
  seoSlug?: string;
}
