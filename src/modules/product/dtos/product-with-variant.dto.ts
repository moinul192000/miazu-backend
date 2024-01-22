import { ApiProperty } from '@nestjs/swagger';

import { ProductDto } from './product.dto';
import { ProductVariantDto } from './product-variant.dto';

export class ProductWithVariantDto extends ProductDto {
  @ApiProperty({ type: [ProductVariantDto] })
  variants!: ProductVariantDto[];
}
