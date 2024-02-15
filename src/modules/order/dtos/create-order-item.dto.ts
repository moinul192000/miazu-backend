import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Product variant ID',
  })
  @IsString()
  @IsUUID()
  productVariantId!: Uuid;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Quantity of the product variant',
  })
  @IsPositive()
  @IsNumber()
  quantity!: number;
}
