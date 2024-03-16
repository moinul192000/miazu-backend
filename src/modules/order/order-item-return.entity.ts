import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { OrderItemReturnDto } from './dtos/order-item-return.dto';
import { OrderItemEntity } from './order-item.entity';
import { ReturnEntity } from './return.entity';

@Entity({ name: 'order_item_return' })
@UseDto(OrderItemReturnDto)
export class OrderItemReturnEntity extends AbstractEntity {
  @ManyToOne(() => OrderItemEntity, (orderItem) => orderItem.itemReturns)
  @JoinColumn({ name: 'orderItemId' })
  orderItem!: OrderItemEntity;

  @ManyToOne(() => ReturnEntity, (returnOrder) => returnOrder.itemReturns)
  returnOrder!: ReturnEntity;

  @Column({ type: 'int', default: 0 })
  returnQuantity!: number;
}
