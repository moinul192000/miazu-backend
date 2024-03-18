import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive, IsString, IsUUID } from 'class-validator';

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
  @Transform(({ value }) => Number(value))
  @IsPositive()
  quantity!: number;

  // Optional Price field
  @ApiPropertyOptional({
    type: 'number',
    example: 100,
    description: 'Price of the product variant',
  })
  @Transform(({ value }) => Number(value))
  @IsPositive()
  price?: number;
}
