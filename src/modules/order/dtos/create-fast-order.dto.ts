import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { OrderChannel } from '../../../constants';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateFastOrderDto {
  @ApiProperty({
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  customerId!: Uuid;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productVariantId: {
          type: 'string',
          example: '123e4567',
          description: 'Product variant ID',
        },
        quantity: {
          type: 'number',
          example: 1,
          description: 'Quantity of the product variant',
        },
      },
    },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  items!: CreateOrderItemDto[];

  @ApiPropertyOptional({
    type: 'string',
    example: '01710000000',
    description: 'Alternate phone number of the customer (BD)',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('BD')
  alternatePhoneNumber?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'Some note',
    description: 'Note for the order',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: OrderChannel,
    example: OrderChannel.FACEBOOK,
    description: 'Channel from which the order was created',
  })
  @IsOptional()
  @IsEnum(OrderChannel)
  orderChannel?: OrderChannel;

  @ApiPropertyOptional({
    type: 'number',
    example: 100,
    description: 'Delivery fee of the order',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  deliveryFee?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 10,
    description: 'Discount of the order',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  discount?: number;
}
