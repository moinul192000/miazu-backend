import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

import { StringField, Trim } from '../../../decorators';

export class CustomerBasicDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
    required: true,
  })
  @StringField({ description: 'Name of the customer', example: 'John Doe' })
  @Trim()
  name!: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '01700000000',
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phoneNumber!: string;
}
