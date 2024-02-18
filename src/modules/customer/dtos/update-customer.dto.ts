import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';

import { StringFieldOptional, Trim } from '../../../decorators';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
    required: false,
  })
  @StringFieldOptional({
    description: 'Name of the customer',
    example: 'John Doe',
  })
  @Trim()
  name?: string;

  @ApiProperty({
    description: 'Address of the customer',
    example: 'Dhaka, Bangladesh',
    required: false,
  })
  @StringFieldOptional({ description: 'Address of the customer' })
  address?: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '01700000000',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('BD')
  phoneNumber?: string;

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
