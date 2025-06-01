import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * DTO used by services when sending audit information
 * to the AuditLogService.
 */
export class CreateAuditLogDto {
  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsNumber()
  actorId: number;

  @IsEnum(['admin', 'vendor', 'user'])
  actorType: 'admin' | 'vendor' | 'user';

  @IsOptional()
  meta?: Record<string, any>;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}