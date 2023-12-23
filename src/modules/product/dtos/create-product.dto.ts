import { FitType } from '../../../constants';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class CreateProductDto {
  @StringField()
  readonly sku!: string;

  @StringFieldOptional()
  readonly barcode?: string;

  @StringField()
  readonly name!: string;

  @StringField()
  readonly brand!: string;

  @StringField()
  readonly material!: string;

  @EnumFieldOptional(() => FitType)
  readonly fit?: string;

  @StringField()
  readonly description!: string;
}
