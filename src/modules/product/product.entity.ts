import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { FitType } from '../../constants';
import { UseDto } from '../../decorators';
import { ProductDto } from './dtos/product.dto';
import { ProductVariantEntity } from './product-variant.entity';

@Entity({ name: 'products' })
@UseDto(ProductDto)
export class ProductEntity extends AbstractEntity<ProductDto> {
  @Column({ unique: true })
  productCode!: string;

  @Column()
  name!: string;

  @Column()
  brand!: string;

  @Column()
  material!: string;

  @Column({ type: 'enum', enum: FitType, default: FitType.REGULAR_FIT })
  fit!: FitType;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product)
  variants!: ProductVariantEntity[];

  @Column()
  description!: string;

  @Column({
    nullable: true,
  })
  thumbnailImageUrl?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;
}
