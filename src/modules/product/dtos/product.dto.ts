import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { FitType } from '../../../constants';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { type ProductEntity } from '../product.entity';

export class ProductDto extends AbstractDto {
  @ApiProperty({
    description: 'Product SKU',
    example: 'SKU-0001',
    type: String,
  })
  @StringField({ maxLength: 25 })
  sku: string;

  @StringFieldOptional()
  barcode?: string;

  @StringField()
  name: string;

  @StringField()
  brand: string;

  @StringField()
  material: string;

  @EnumFieldOptional(() => FitType)
  fit?: FitType;

  @StringField()
  description: string;

  constructor(productEntity: ProductEntity) {
    super(productEntity);
    this.sku = productEntity.sku;
    this.barcode = productEntity.barcode;
    this.name = productEntity.name;
    this.brand = productEntity.brand;
    this.material = productEntity.material;
    this.fit = productEntity.fit;
    this.description = productEntity.description;
  }
}
