import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SetDefaultAddressDto {
  @ApiProperty({ example: 7, description: 'Address ID to set as default' })
  @IsNotEmpty()
  @IsNumber()
  addressId: number;
}
