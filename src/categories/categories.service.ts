/**
 * @file categories.service.ts
 * @description Business logic for managing categories with multilingual, hierarchy, icon/banner, sort order, SEO, and soft delete support.
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create a new category with full advanced options.
   * Supports parent/child hierarchy, icons, banners, multi-language, sort, and SEO fields.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Destructure all fields from DTO
    const {
      nameEn,
      nameAr,
      slug,
      descriptionEn,
      descriptionAr,
      iconUrl,
      bannerUrl,
      sortOrder,
      parentId,
      isActive,
      isFeatured,
      seoTitle,
      seoDescription,
      seoSlug,
    } = createCategoryDto;

    // Instantiate new category entity
    const category = new Category();
    category.nameEn = nameEn;
    category.nameAr = nameAr;
    category.slug = slug;
    category.descriptionEn = descriptionEn;
    category.descriptionAr = descriptionAr;
    category.iconUrl = iconUrl;
    category.bannerUrl = bannerUrl;
    category.sortOrder = sortOrder ?? 0; // Default sort order to 0 if not provided
    category.isActive = isActive ?? true; // Default to active
    category.isFeatured = isFeatured ?? false; // Default to not featured
    category.seoTitle = seoTitle;
    category.seoDescription = seoDescription;
    category.seoSlug = seoSlug;

    // Handle parent/child relationship (category hierarchy)
    if (parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) throw new NotFoundException('Parent category not found');
      category.parent = parent;
    }

    // Save to database
    const savedCategory = await this.categoryRepository.save(category);
    this.logger.log(`Created new category ID: ${savedCategory.id}`);
    return savedCategory;
  }

  /**
   * Find all categories with their parent/children relations.
   * Used for admin dashboards and category trees.
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
      order: { sortOrder: 'ASC', nameEn: 'ASC' }, // Sort by order then name
      where: { isActive: true }, // Only active categories by default
    });
  }

  /**
   * Find a single category by ID, including hierarchy.
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  /**
   * Update category and all advanced fields.
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Fetch category by ID
    const category = await this.findOne(id);

    // If parentId is provided, update parent relation
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === null) {
        category.parent = null;
      } else {
        const parent = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parentId },
        });
        if (!parent) throw new NotFoundException('Parent category not found');
        category.parent = parent;
      }
    }

    // Assign all updatable fields
    Object.assign(category, updateCategoryDto);

    // Save updated category
    const updated = await this.categoryRepository.save(category);
    this.logger.log(`Updated category ID: ${updated.id}`);
    return updated;
  }

  /**
   * Soft delete (not physical remove) for audit and safety.
   * Category will be marked as deleted, not removed from DB.
   */
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.softRemove(category);
    this.logger.log(`Soft deleted category ID: ${id}`);
  }

  /**
   * Restore a soft-deleted category.
   */
  async restore(id: number): Promise<Category> {
    await this.categoryRepository.restore(id);
    const restored = await this.findOne(id);
    this.logger.log(`Restored category ID: ${id}`);
    return restored;
  }
}
