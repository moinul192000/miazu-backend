import { IsPositive } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ReturnReason } from '../../constants';
import { UseDto } from '../../decorators';
import { ReturnDto } from './dtos/return.dto';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'returns' })
@UseDto(ReturnDto)
export class ReturnEntity extends AbstractEntity<ReturnDto> {
  @ManyToMany(() => OrderItemEntity, (orderItem) => orderItem.returns)
  orderItems!: OrderItemEntity[];

  @Column({ type: 'int', default: 1 })
  @IsPositive()
  quantityReturned!: number;

  @Column({ type: 'enum', enum: ReturnReason, default: ReturnReason.OTHER })
  reason!: ReturnReason;

  @Column({ type: 'float', nullable: true })
  restockingFee?: number;

  @Column({ type: 'boolean', default: false })
  isReturned!: boolean;

  @Column({ type: 'boolean', default: true })
  isExchange!: boolean;
}
