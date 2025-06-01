import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { PaymentMethod } from '../entities/payment-transaction.entity';

export class CreatePaymentDto {
  @ApiProperty({ example: 12345 })
  @IsNumber()
  orderId: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 10000.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'SYP', description: 'ISO currency code' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'web', required: false })
  @IsOptional()
  @IsString()
  channel?: string;
}
