import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { ProductVariantDto } from './dtos/product-variant.dto';
import { ProductEntity } from './product.entity';
import { PromotionalFlagEntity } from './promotional-flag.entity';
import { StockAdjustmentLogEntity } from './stock-adjustment-log.entity';

@Entity({ name: 'product_variants' })
@UseDto(ProductVariantDto)
@Unique(['product', 'size', 'color'])
export class ProductVariantEntity extends AbstractEntity<ProductVariantDto> {
  @Column({ unique: true, nullable: false })
  sku!: string;

  @Column({ nullable: true })
  barcode?: string;

  @ManyToOne(() => ProductEntity, (product) => product.variants)
  product!: ProductEntity;

  @Column()
  size!: string;

  @Column()
  color!: string;

  @Column()
  stockLevel!: number;

  @OneToOne(
    () => PromotionalFlagEntity,
    (promotionalFlag) => promotionalFlag.productVariant,
  )
  promotionalFlags?: PromotionalFlagEntity;

  @OneToMany(() => StockAdjustmentLogEntity, (log) => log.productVariant)
  stockAdjustments!: StockAdjustmentLogEntity[];
}
