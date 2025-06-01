/**
 * @file create-brand.dto.ts
 * @description DTO for creating a new brand.
 */
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Apple', description: 'Brand Name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'apple', description: 'SEO-friendly slug' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 'https://cdn.souqsyria.com/brands/apple-logo.png',
    description: 'Logo Image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
