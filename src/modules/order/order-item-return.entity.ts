import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OrderItemEntity } from './order-item.entity';
import { ReturnEntity } from './return.entity';

@Entity({ name: 'order_item_return' })
export class OrderItemReturnEntity extends AbstractEntity {
  @ManyToOne(() => OrderItemEntity, (orderItem) => orderItem.itemReturns)
  orderItem!: OrderItemEntity;

  @ManyToOne(() => ReturnEntity, (returnOrder) => returnOrder.itemReturns)
  returnOrder!: ReturnEntity;

  @Column({ type: 'int', default: 0 })
  returnQuantity!: number;
}
