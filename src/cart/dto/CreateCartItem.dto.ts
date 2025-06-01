/**
 * 🧾 CreateCartItemDto
 *
 * DTO used to add a product variant to the user's cart.
 * Supports quantity, optional discount price, selected attributes,
 * expiration for time-limited deals, and campaign tracking.
 */

import {
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
  IsString,
} from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  variant_id: number;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price_discounted?: number;

  @IsOptional()
  selected_attributes?: Record<string, any>; // Optional: color, size, etc.

  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @IsOptional()
  @IsString()
  added_from_campaign?: string;
}
