/**
 * @file categories-public.controller.ts
 * @description Public Categories Controller for Customer-Facing APIs
 *
 * RESPONSIBILITIES:
 * - Serve active and approved categories to customers
 * - Provide navigation trees for frontend menus
 * - Handle public search and autocomplete
 * - Support Arabic/English localization
 * - Optimize for Syrian internet speeds
 * - Mobile-first response optimization
 *
 * FEATURES:
 * - No authentication required
 * - Only public categories (active + approved)
 * - Caching headers for performance
 * - Syrian market optimizations (Arabic slugs, RTL)
 * - Local vs diaspora user detection
 * - SEO-optimized responses
 *
 * @author SouqSyria Development Team
 * @since 2025-06-01
 * @version 1.0.0
 */

import { BadRequestException, Controller, Get, HttpStatus, Logger, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

// Import Services
import { CategorySearchService } from '../services/category-search.service';
import { CategoryHierarchyService } from '../services/category-hierarchy.service';
import { CategoriesService } from '../services/categories.service';

// Import DTOs and Types
import { CategoryQueryDto } from '../dto/index-dto';

/**
 * PUBLIC CATEGORIES CONTROLLER
 *
 * Customer-facing API endpoints for category browsing, search, and navigation.
 * All endpoints are public (no authentication) and serve only active, approved categories.
 *
 * Route Pattern: /api/categories/*
 * Authentication: None required
 * Rate Limiting: Applied for DDoS protection
 * Caching: Aggressive caching for performance
 */
@ApiTags('Public Categories')
@Controller('categories')
export class CategoriesPublicController {
  private readonly logger = new Logger(CategoriesPublicController.name);

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly categorySearchService: CategorySearchService,
    private readonly categoryHierarchyService: CategoryHierarchyService,
  ) {
    this.logger.log('🌐 Public Categories Controller initialized');
  }

  // ============================================================================
  // CORE PUBLIC ENDPOINTS
  // ============================================================================

  /**
   * GET ACTIVE CATEGORIES WITH PAGINATION
   *
   * Returns paginated list of active, approved categories for customer browsing.
   * Optimized for mobile and slow Syrian internet connections.
   *
   * Features:
   * - Only active + approved categories
   * - Lightweight response (no admin fields)
   * - Pagination for performance
   * - Language preference support
   * - Mobile-optimized data structure
   * - Caching headers for 5 minutes
   */
  @Get()
  @ApiOperation({
    summary: 'Get active categories with pagination',
    description: `
      Retrieve paginated list of active, approved categories for customer browsing.
      
      Features:
      • Mobile-optimized responses
      • Arabic/English localization support
      • Caching for improved performance
      • Only public categories (active + approved)
      • Optimized for Syrian internet speeds
      
      Use Cases:
      • Category listing pages
      • Mobile app category browsing
      • Homepage category sections
      • Product filtering interfaces
    `,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
    description: 'Page number for pagination (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 20,
    description: 'Items per page (max: 50, default: 20)',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: ['en', 'ar'],
    example: 'en',
    description: 'Response language preference',
  })
  @ApiQuery({
    name: 'featured',
    required: false,
    type: 'boolean',
    example: false,
    description: 'Filter for featured categories only',
  })
  @ApiQuery({
    name: 'parent',
    required: false,
    type: 'number',
    description: 'Filter by parent category ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    headers: {
      'Cache-Control': {
        description: 'Caching directive for performance',
        schema: { type: 'string', example: 'public, max-age=300' },
      },
      'Content-Language': {
        description: 'Response language',
        schema: { type: 'string', example: 'en' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getActiveCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('language') language: 'en' | 'ar' = 'en',
    @Query('featured') featured: boolean = false,
    @Query('parent') parentId?: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const startTime = Date.now();
    const clientIP = this.getClientIP(request);
    const userAgent = request.headers['user-agent'] || 'unknown';

    this.logger.log(
      `📱 Public categories request: page=${page}, limit=${limit}, lang=${language}, IP=${clientIP}`,
    );

    try {
      // 1. Validate and sanitize input parameters
      const sanitizedParams = this.validatePublicQueryParams({
        page,
        limit,
        language,
        featured,
        parentId,
      });

      // 2. Detect user context (Syrian local vs diaspora)
      const userContext = this.detectUserContext(request);

      // 3. Build query for public categories only
      const queryDto: CategoryQueryDto = {
        page: sanitizedParams.page,
        limit: sanitizedParams.limit,
        language: sanitizedParams.language,
        isActive: true,
        approvalStatus: 'approved' as any,
        isFeatured: sanitizedParams.featured ? true : undefined,
        parentId: sanitizedParams.parentId,
        showInNav: true,
        includeDeleted: false,
        includeHierarchy: true,
      };

      // 4. Execute search with public-only results
      const result =
        await this.categorySearchService.searchCategories(queryDto);

      // 5. Transform to public response format
      const publicResponse = this.transformToPublicResponse(
        result,
        sanitizedParams.language,
        userContext,
      );

      // 6. Set performance headers
      this.setPerformanceHeaders(response, sanitizedParams.language);

      // 7. Log successful request
      const processingTime = Date.now() - startTime;
      this.logger.log(
        `✅ Public categories served: ${publicResponse.data.length}/${publicResponse.total} items (${processingTime}ms)`,
      );

      // 8. Return response with proper status
      return response.status(HttpStatus.OK).json({
        success: true,
        data: publicResponse.data,
        pagination: {
          page: publicResponse.page,
          limit: publicResponse.limit,
          total: publicResponse.total,
          totalPages: publicResponse.totalPages,
          hasNext: publicResponse.hasNext,
          hasPrev: publicResponse.hasPrev,
        },
        meta: {
          language: sanitizedParams.language,
          userContext: userContext.type,
          processingTime,
          cached: false, // Will be true when caching is implemented
        },
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;

      this.logger.error(
        `❌ Public categories failed: ${error.message} (${processingTime}ms)`,
        {
          error: error.message,
          stack: error.stack,
          clientIP,
          userAgent,
          params: { page, limit, language, featured, parentId },
        },
      );

      // Return error response without throwing
      if (error instanceof BadRequestException) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Invalid request parameters',
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve categories. Please try again.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * GET FEATURED CATEGORIES FOR HOMEPAGE
   *
   * Returns featured categories optimized for homepage display.
   * Heavily cached and optimized for quick loading.
   */
  @Get('featured')
  @ApiOperation({
    summary: 'Get featured categories for homepage',
    description: `
      Retrieve featured categories optimized for homepage display.
      
      Features:
      • Heavily cached for performance
      • Mobile-first data structure
      • Arabic/English support
      • Optimized image URLs
      • Click tracking ready
      
      Use Cases:
      • Homepage category carousel
      • Mobile app featured section
      • Landing page highlights
    `,
  })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: ['en', 'ar'],
    example: 'en',
    description: 'Response language preference',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 8,
    description: 'Maximum number of featured categories (max: 20)',
  })
  @ApiResponse({
    status: 200,
    description: 'Featured categories retrieved successfully',
    headers: {
      'Cache-Control': {
        description: 'Long cache for featured content',
        schema: { type: 'string', example: 'public, max-age=900' },
      },
    },
  })
  async getFeaturedCategories(
    @Query('language') language: 'en' | 'ar' = 'en',
    @Query('limit') limit: number = 8,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const startTime = Date.now();

    this.logger.log(
      `⭐ Featured categories request: lang=${language}, limit=${limit}`,
    );

    try {
      // 1. Validate parameters
      const sanitizedLimit = Math.min(Math.max(1, limit || 8), 20);
      const sanitizedLanguage = ['en', 'ar'].includes(language)
        ? language
        : 'en';

      // 2. Query featured categories
      const queryDto: CategoryQueryDto = {
        page: 1,
        limit: sanitizedLimit,
        language: sanitizedLanguage,
        isActive: true,
        approvalStatus: 'approved' as any,
        isFeatured: true,
        showInNav: true,
        includeDeleted: false,
        sortBy: 'sortOrder' as any,
        sortOrder: 'ASC' as any,
      };

      const result =
        await this.categorySearchService.searchCategories(queryDto);

      // 3. Transform to featured response format
      const featuredResponse = result.data.map((category) => ({
        id: category.id,
        name: category.displayName,
        slug: category.slug,
        description: category.displayDescription,
        iconUrl: category.iconUrl,
        bannerUrl: category.bannerUrl,
        themeColor: category.themeColor,
        url: category.url,
        productCount: category.productCount,
        isActive: category.isActive,
      }));

      // 4. Set long cache headers for featured content
      response.set({
        'Cache-Control': 'public, max-age=900', // 15 minutes
        'Content-Language': sanitizedLanguage,
        'X-Content-Type-Options': 'nosniff',
      });

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `✅ Featured categories served: ${featuredResponse.length} items (${processingTime}ms)`,
      );

      return response.status(HttpStatus.OK).json({
        success: true,
        data: featuredResponse,
        meta: {
          count: featuredResponse.length,
          language: sanitizedLanguage,
          processingTime,
          cached: false,
        },
      });
    } catch (error) {
      this.logger.error(`❌ Featured categories failed: ${error.message}`);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to retrieve featured categories',
        message: 'Please try again later',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * VALIDATE PUBLIC QUERY PARAMETERS
   */
  private validatePublicQueryParams(params: any): any {
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(params.limit) || 20), 50); // Max 50 for public
    const language = ['en', 'ar'].includes(params.language)
      ? params.language
      : 'en';
    const featured = params.featured === true || params.featured === 'true';
    const parentId = params.parentId ? parseInt(params.parentId) : undefined;

    return { page, limit, language, featured, parentId };
  }

  /**
   * DETECT USER CONTEXT (Syrian local vs diaspora)
   */
  private detectUserContext(request: Request): {
    type: 'local' | 'diaspora';
    country?: string;
  } {
    // Check IP for Syrian ranges (simplified - in production use proper GeoIP)
    const clientIP = this.getClientIP(request);

    // Accept-Language header analysis
    const acceptLanguage = request.headers['accept-language'] || '';
    const prefersArabic = acceptLanguage.includes('ar');

    // Simple heuristic - in production, use proper GeoIP service
    const isSyrianIP = clientIP.startsWith('192.168.') || prefersArabic; // Placeholder logic

    return {
      type: isSyrianIP ? 'local' : 'diaspora',
      country: isSyrianIP ? 'Syria' : 'Unknown',
    };
  }

  /**
   * GET CLIENT IP ADDRESS
   */
  private getClientIP(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string) ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }

  /**
   * SET PERFORMANCE HEADERS
   */
  private setPerformanceHeaders(response: Response, language: string): void {
    response.set({
      'Cache-Control': 'public, max-age=300', // 5-minute cache
      'Content-Language': language,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Robots-Tag': 'index, follow',
    });
  }

  /**
   * TRANSFORM TO PUBLIC RESPONSE FORMAT
   */
  private transformToPublicResponse(
    result: any,
    language: string,
    userContext: any,
  ): any {
    // Remove admin-only fields and optimize for public consumption
    const publicData = result.data.map((category) => ({
      id: category.id,
      name: category.displayName,
      slug: category.slug,
      description: category.displayDescription,
      iconUrl: category.iconUrl,
      bannerUrl: category.bannerUrl,
      themeColor: category.themeColor,
      url: category.url,
      productCount: category.productCount,
      isActive: category.isActive,
      hasChildren: category.hasChildren,
      parent: category.parent
        ? {
            id: category.parent.id,
            name: category.parent.name,
            slug: category.parent.slug,
          }
        : null,
      children:
        category.children?.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          productCount: child.productCount,
        })) || [],
    }));

    return {
      ...result,
      data: publicData,
    };
  }
}
