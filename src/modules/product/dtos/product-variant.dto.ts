import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { type ProductVariantEntity } from '../product-variant.entity';
import { ProductDto } from './product.dto';

export class ProductVariantDto extends AbstractDto {
  @ApiProperty({
    description: 'Product SKU',
    example: 'SKU-0001',
    type: String,
  })
  @StringField({
    maxLength: 25,
    minLength: 5,
    required: true,
    example: 'SKU-0001',
  })
  sku!: string;

  @StringFieldOptional()
  barcode?: string;

  @StringField({ maxLength: 25 })
  size!: string;

  @StringField({ maxLength: 50 })
  color!: string;

  @NumberFieldOptional({ min: 0 })
  stockLevel?: number;

  @Type(() => ProductDto)
  product?: ProductDto;

  constructor(productVariantEntity: ProductVariantEntity) {
    super(productVariantEntity);
    this.sku = productVariantEntity.sku;
    this.barcode = productVariantEntity.barcode;
    this.size = productVariantEntity.size;
    this.color = productVariantEntity.color;
    this.stockLevel = productVariantEntity.stockLevel;
    this.product = new ProductDto(productVariantEntity.product);
  }
}
