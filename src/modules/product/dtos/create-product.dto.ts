import { Transform } from 'class-transformer';

import { FitType } from '../../../constants';
import { EnumFieldOptional, StringField } from '../../../decorators';

export class CreateProductDto {
  @StringField({
    minLength: 3,
    maxLength: 25,
    description: 'Product code',
    example: 'PJ-B01',
    required: true,
  })
  readonly productCode!: string;

  @StringField({
    minLength: 3,
    maxLength: 50,
    description: 'Name of the product',
    example: 'Pajama',
    required: true,
  })
  readonly name!: string;

  @StringField()
  readonly brand!: string;

  @StringField({
    minLength: 3,
    maxLength: 50,
    description: 'Material of the product',
    example: 'Cotton',
    required: true,
  })
  readonly material!: string;

  @EnumFieldOptional(() => FitType, {
    default: FitType.REGULAR_FIT,
    description: 'Fit type',
    example: FitType.REGULAR_FIT,
  })
  readonly fit?: FitType;

  @StringField({
    minLength: 3,
    maxLength: 250,
    description: 'Product description',
    example: 'This is a pajama',
    required: true,
  })
  readonly description!: string;

  @StringField({
    description: 'Price of the product',
    example: '100.00',
    required: true,
  })
  @Transform(({ value }) => Number.parseFloat(value as string))
  readonly price!: number;
}
