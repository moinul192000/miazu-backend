import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ReturnReason } from '../../constants';
import { UseDto } from '../../decorators';
import { ReturnDto } from './dtos/return.dto';
import { OrderEntity } from './order.entity';
import { OrderItemReturnEntity } from './order-item-return.entity';

@Entity({ name: 'returns' })
@UseDto(ReturnDto)
export class ReturnEntity extends AbstractEntity<ReturnDto> {
  @OneToOne(() => OrderEntity, (order) => order.returnOrder)
  @JoinColumn()
  order!: OrderEntity;

  @OneToMany(
    () => OrderItemReturnEntity,
    (itemReturn) => itemReturn.returnOrder,
  )
  itemReturns!: OrderItemReturnEntity[];

  @Column({ type: 'enum', enum: ReturnReason, default: ReturnReason.OTHER })
  reason!: ReturnReason;

  @Column({ type: 'float', nullable: true })
  restockingFee?: number;

  @Column({ type: 'boolean', default: false })
  isReturned!: boolean;

  @Column({ type: 'boolean', default: true })
  isExchange!: boolean;

  @OneToOne(() => OrderEntity, (order) => order.exchangeOrder, {
    nullable: true,
  })
  exchangeOrder?: OrderEntity;
}
