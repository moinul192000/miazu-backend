import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity({ name: 'stock_adjustment_logs' })
export class StockAdjustmentLogEntity extends AbstractEntity {
  @Column({ type: 'int' })
  previousStockLevel!: number;

  @Column({ type: 'int' })
  adjustmentAmount!: number;

  @Column({ type: 'int' })
  newStockLevel!: number;

  @Column({ type: 'timestamp' })
  adjustmentDate!: Date;

  @Column({ type: 'varchar', length: 255 })
  adjustedBy!: string;

  @ManyToOne(() => ProductVariantEntity, (variant) => variant.stockAdjustments)
  productVariant!: ProductVariantEntity;

  @Column({ type: 'text', nullable: true })
  reason?: string;
}
