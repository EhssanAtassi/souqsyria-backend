/**
 * @file categories.module.ts
 * @description Categories Module with all services, controllers, and dependencies
 *
 * FEATURES:
 * - Complete service dependency injection
 * - TypeORM entity registration
 * - ACL integration with guards
 * - Audit logging integration
 * - Modular service architecture
 *
 * SERVICES INCLUDED:
 * - CategoriesService (Core CRUD)
 * - CategoryHierarchyService (Tree management)
 * - CategoryApprovalService (Workflow)
 * - CategorySearchService (Search & filtering)
 * - CategoryAnalyticsService (Metrics & analytics)
 *
 * @author SouqSyria Development Team
 * @since 2025-06-01
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ================================
// ENTITIES
// ================================
import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity';

// ================================
// CONTROLLERS
// ================================
import { CategoriesController } from './controllers/categories.controller';

// ================================
// CORE SERVICES
// ================================
import { CategoriesService } from './services/categories.service';
import { CategoryHierarchyService } from './services/category-hierarchy.service';
import { CategoryApprovalService } from './services/category-approval.service';
import { CategorySearchService } from './services/category-search.service';
// import { CategoryAnalyticsService } from './services/category-analytics.service';
// ================================
// EXTERNAL MODULES
// ================================
import { AuditLogModule } from '../audit-log/audit-log.module';
import { GuardsModule } from '../common/guards/guards.module';
import { CategoriesAdminController } from './controllers/categories-admin.controller';
import { CategoriesPublicController } from './controllers/categories-public.controller';

@Module({
  imports: [
    // ================================
    // DATABASE ENTITIES REGISTRATION
    // ================================
    TypeOrmModule.forFeature([
      Category, // Main category entity
      User, // For audit trails and permissions
      Route, // For ACL permissions guard
    ]),

    // ================================
    // EXTERNAL MODULE DEPENDENCIES
    // ================================
    AuditLogModule, // For audit trail logging
    GuardsModule, // For ACL permissions guard (Global module)
  ],

  // ================================
  // API CONTROLLERS
  // ================================
  controllers: [
    CategoriesController,
    CategoriesAdminController,
    CategoriesPublicController, // Admin category management endpoints
    // TODO: Add CategoriesPublicController for customer APIs
  ],

  // ================================
  // SERVICE PROVIDERS
  // ================================
  providers: [
    // Core CRUD service
    CategoriesService,

    // Specialized services (modular architecture)
    CategoryHierarchyService, // Parent/child tree management
    CategoryApprovalService, // Workflow and approval logic
    CategorySearchService, // Search, filtering, pagination
    // CategoryAnalyticsService, // Metrics and performance analytics

    // TODO: Add CategoryCacheService for performance
    // TODO: Add CategoryImageService for media management
    // TODO: Add CategoryTemplateService for dynamic forms
  ],

  // ================================
  // MODULE EXPORTS
  // ================================
  exports: [
    // Export TypeORM for other modules that need Category entity
    TypeOrmModule,

    // Export core service for other modules to use
    CategoriesService,

    // Export specialized services for inter-module usage
    CategoryHierarchyService,
    CategorySearchService,
    // CategoryAnalyticsService,

    // CategoryApprovalService kept internal (admin workflow only)
  ],
})
export class CategoriesModule {
  constructor() {
    console.log('🚀 Categories Module initialized with enterprise features');
  }
}
