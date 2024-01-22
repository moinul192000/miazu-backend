import {
  NumberFieldOptional,
  StringField,
  UUIDField,
} from '../../../decorators';

export class CreateProductVariantDto {
  @UUIDField({
    description: 'Product id (uuid v4)',
    example: 'e4f8c5a6-8d5a-4f7e-8f5b-9b9a4c1b8a1e',
    required: true,
  })
  productId!: Uuid;

  @StringField({
    maxLength: 25,
    minLength: 5,
    description: 'Product SKU',
    example: 'SKU-0001',
    required: true,
  })
  sku!: string;

  @StringField({
    maxLength: 25,
    minLength: 1,
    required: true,
    description: 'Product size',
    example: 'M',
  })
  size!: string;

  @StringField({ maxLength: 50, minLength: 1, required: true, example: 'Red' })
  color!: string;

  @NumberFieldOptional({
    min: 0,
    default: 0,
    example: 100,
    description: 'Stocks of this product variant',
  })
  stockLevel?: number;
}
