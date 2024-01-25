import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OrderStatus } from '../../constants/order-status';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { OrderDto } from './dtos/order.dto';
import { OrderItemEntity } from './order-item.entity';
import { OrderLogEntity } from './order-log.entity';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  @ManyToOne(() => UserEntity, (user) => user.orders)
  user!: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  items!: OrderItemEntity[];

  @OneToMany(() => OrderLogEntity, (orderLog) => orderLog.order)
  logs!: OrderLogEntity[];

  @Column({ type: 'enum', default: OrderStatus.PENDING, enum: OrderStatus })
  status!: OrderStatus;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  alternatePhoneNumber?: string | null;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'text', nullable: true })
  note?: string | null;
}
