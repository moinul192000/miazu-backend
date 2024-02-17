import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Trim } from '../../../decorators';
import { type CustomerEntity } from '../customer.entity';

export class CustomerDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber('BD')
  @Trim()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  alternatePhoneNumber?: string | null;

  @IsOptional()
  @IsString()
  @Trim()
  socialMediaId?: string | null;

  constructor(customer: CustomerEntity) {
    super(customer);
    this.name = customer.name;
    this.address = customer.address;
    this.phoneNumber = customer.phoneNumber;
    this.alternatePhoneNumber = customer.alternatePhoneNumber;
    this.socialMediaId = customer.socialMediaId;
  }
}
