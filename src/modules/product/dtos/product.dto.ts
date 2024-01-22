import { AbstractDto } from '../../../common/dto/abstract.dto';
import { FitType } from '../../../constants';
import { EnumFieldOptional, StringField } from '../../../decorators';
import { type ProductEntity } from '../product.entity';

export class ProductDto extends AbstractDto {
  @StringField({
    minLength: 3,
    maxLength: 25,
    description: 'Product code',
    example: 'PJ-B01',
    required: true,
  })
  readonly productCode!: string;

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
    this.productCode = productEntity.productCode;
    this.name = productEntity.name;
    this.brand = productEntity.brand;
    this.material = productEntity.material;
    this.fit = productEntity.fit;
    this.description = productEntity.description;
  }
}
