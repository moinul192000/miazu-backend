import { ApiProperty } from '@nestjs/swagger';

import {
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/';

export class UpdateStockDto {
  @ApiProperty({
    description: 'Adjustment amount',
    example: '1 or -1',
    type: Number,
  })
  @NumberField()
  adjustmentAmount!: number;

  @ApiProperty({
    description: 'Adjusted by user id',
    example: 'admin',
    type: String,
  })
  @StringField({ maxLength: 255 })
  adjustedBy!: string;

  @ApiProperty({
    description: 'Reason for adjustment',
    example: 'Damaged',
    type: String,
  })
  @StringFieldOptional({ maxLength: 255 })
  reason?: string;
}
