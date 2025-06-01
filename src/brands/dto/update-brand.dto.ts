/**
 * @file update-brand.dto.ts
 * @description DTO for updating a brand (partial fields).
 */
import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
