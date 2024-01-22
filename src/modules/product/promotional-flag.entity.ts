import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity({ name: 'promotional_flags' })
export class PromotionalFlagEntity extends AbstractEntity {
  @Column({ default: false })
  featured!: boolean;

  @Column({ default: false })
  newArrival!: boolean;

  @Column({ default: false })
  sale!: boolean;

  @Column()
  salePrice?: number;

  @OneToOne(
    () => ProductVariantEntity,
    (productVariant) => productVariant.promotionalFlags,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  productVariant!: ProductVariantEntity;
}
