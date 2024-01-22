import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OrderStatus } from '../../constants/order-status';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { OrderDto } from './dtos/order.dto';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  @ManyToOne(() => UserEntity, (user) => user.orders)
  user!: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  items!: OrderItemEntity[];

  // @OneToMany(() => OrderLogEntity, (orderLog) => orderLog.order)
  // logs!: OrderLogEntity[];

  @Column({ type: 'enum', default: OrderStatus.PENDING, enum: OrderStatus })
  status!: OrderStatus;
}
