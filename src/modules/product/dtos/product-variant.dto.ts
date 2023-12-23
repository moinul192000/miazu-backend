import { AbstractDto } from '../../../common/dto/abstract.dto';
import { NumberFieldOptional, StringField } from '../../../decorators';
import { type ProductVariantEntity } from '../product-variant.entity';

export class ProductVariantDto extends AbstractDto {
  @StringField({ maxLength: 25 })
  size!: string;

  @StringField({ maxLength: 50 })
  color!: string;

  @NumberFieldOptional({ min: 0 })
  stockLevel?: number;

  constructor(productVariantEntity: ProductVariantEntity) {
    super(productVariantEntity);
    this.size = productVariantEntity.size;
    this.color = productVariantEntity.color;
    this.stockLevel = productVariantEntity.stockLevel;
  }
}
