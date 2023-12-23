import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { ProductVariantDto } from './dtos/product-variant.dto';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_variants' })
@UseDto(ProductVariantDto)
export class ProductVariantEntity extends AbstractEntity<ProductVariantDto> {
  @ManyToOne(() => ProductEntity, (product) => product.variants)
  product!: ProductEntity;

  @Column()
  @Index({ unique: true })
  size!: string;

  @Column()
  @Index({ unique: true })
  color!: string;

  @Column()
  stockLevel!: number;
}
