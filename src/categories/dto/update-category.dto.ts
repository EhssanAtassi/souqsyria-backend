/**
 * @file update-category.dto.ts
 * @description DTO for updating an existing category.
 */
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
