import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ReturnReason } from '../../../constants';
import {
  ApiEnumProperty,
  BooleanFieldOptional,
  NumberField,
  NumberFieldOptional,
  UUIDField,
} from '../../../decorators';

class CreateReturnItemDto {
  @UUIDField({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Order item ID',
  })
  orderItemId!: string;

  @NumberField({
    example: 1,
    description: 'Return quantity',
    isPositive: true,
  })
  returnQuantity!: number;
}

export class CreateReturnDto {
  @ApiEnumProperty(() => ReturnReason, {
    description: 'Return reason',
  })
  reason!: ReturnReason;

  @NumberFieldOptional({
    example: 1,
    description: 'Restocking fee',
  })
  restockingFee!: number;

  @BooleanFieldOptional({
    example: true,
    description: 'Is returned',
  })
  isReturned!: boolean;

  @BooleanFieldOptional({
    example: true,
    description: 'Is exchange',
  })
  isExchange!: boolean;

  @ApiProperty({
    type: CreateReturnItemDto,
    description: 'Return items with quantity',
    isArray: true,
    example: [
      {
        orderItemId: '123e4567-e89b-12d3-a456-426614174000',
        returnQuantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  itemReturns!: CreateReturnItemDto[];
}
