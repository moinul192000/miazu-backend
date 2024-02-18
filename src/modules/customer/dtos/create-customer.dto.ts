import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

import { StringField, StringFieldOptional, Trim } from '../../../decorators';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
    required: true,
    type: 'string',
  })
  @StringField({ description: 'Name of the customer', example: 'John Doe' })
  @Trim()
  name!: string;

  @ApiProperty({
    description: 'Address of the customer',
    example: 'Dhaka, Bangladesh',
    required: true,
  })
  @StringField({ description: 'Address of the customer' })
  address!: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '01700000000',
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phoneNumber!: string;

  @ApiProperty({
    description: 'Alternate phone number of the customer',
    example: '01700000000',
    required: false,
  })
  @StringFieldOptional({
    description: 'Alternate phone number of the customer',
    example: '01700000000',
  })
  alternatePhoneNumber?: string;

  @ApiProperty({
    description: 'Social media id of the customer',
    example: 'facebook/username',
    required: false,
  })
  @StringFieldOptional({
    description: 'Social media id of the customer',
    example: 'facebook/username',
  })
  socialMediaId?: string;
}
