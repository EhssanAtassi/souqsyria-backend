/**
 * @file public-products.service.ts
 * @description Handles customer-facing product queries (catalog feed).
 */
import { Injectable, Logger } from '@nestjs/common';
import { GetPublicProductsDto } from '../dto/get-public-products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicProductsService {
  private readonly logger = new Logger(PublicProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  /**
   * Fetches a public product list with filters and pagination
   */
  async getPublicFeed(filters: GetPublicProductsDto) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.pricing', 'pricing')
      .leftJoinAndSelect('product.images', 'images')
      .where(
        'product.isActive = true AND product.isPublished = true AND product.is_deleted = false',
      )
      .andWhere('pricing.isActive = true');

    if (filters.search) {
      query.andWhere('product.nameEn LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.categoryId) {
      query.andWhere('product.category_id = :cid', { cid: filters.categoryId });
    }

    if (filters.manufacturerId) {
      query.andWhere('product.manufacturer_id = :mid', {
        mid: filters.manufacturerId,
      });
    }

    if (filters.minPrice) {
      query.andWhere(
        '(pricing.discountPrice IS NOT NULL AND pricing.discountPrice >= :min) OR (pricing.discountPrice IS NULL AND pricing.basePrice >= :min)',
        { min: filters.minPrice },
      );
    }

    if (filters.maxPrice) {
      query.andWhere(
        '(pricing.discountPrice IS NOT NULL AND pricing.discountPrice <= :max) OR (pricing.discountPrice IS NULL AND pricing.basePrice <= :max)',
        { max: filters.maxPrice },
      );
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      data: data.map((product) => ({
        id: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        mainImage: product.images?.[0]?.imageUrl ?? null,
        finalPrice:
          product.pricing?.discountPrice ?? product.pricing?.basePrice,
        currency: product.pricing?.currency ?? 'SYP',
      })),
      meta: { total, page, limit },
    };
  }
}
