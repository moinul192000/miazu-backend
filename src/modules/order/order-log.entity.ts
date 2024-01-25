import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { OrderLogDto } from './dtos/order-log.dto';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_logs' })
@UseDto(OrderLogDto)
export class OrderLogEntity extends AbstractEntity<OrderLogDto> {
  @ManyToOne(() => OrderEntity, (order) => order.logs)
  order!: OrderEntity;

  @Column()
  description!: string;
}
