import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { OrderChannel, OrderStatus } from '../../../constants';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateAdminOrderDto {
  @ApiProperty({
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: Uuid;

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

  @ApiProperty({
    type: 'string',
    example: '01710000000',
    description: 'Phone number of the customer (BD)',
  })
  @IsString()
  @IsPhoneNumber('BD')
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({
    type: 'string',
    example: 'Dhaka, Bangladesh',
    description: 'Address of the customer',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

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
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Status of the order',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    type: 'enum',
    enum: OrderChannel,
    example: OrderChannel.FACEBOOK,
    description: 'Channel from which the order was created',
  })
  @IsOptional()
  @IsEnum(OrderChannel)
  orderChannel?: OrderChannel;
}
