import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import {
  PhoneField,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators/';
import { CreateOrderItemDTO } from './create-order-item.dto';

export class CreateOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items!: CreateOrderItemDTO[];

  @StringFieldOptional({
    description: 'Delviery Address',
  })
  address?: string;

  @PhoneField({
    description: 'Phone number',
  })
  phoneNumber!: string;

  @PhoneFieldOptional({
    description: 'Alternative phone number',
  })
  alternativePhoneNumber?: string;

  @StringFieldOptional({
    description: 'Note for the order (optional)',
  })
  note?: string;
}
