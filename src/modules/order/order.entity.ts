import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OrderChannel, OrderStatus } from '../../constants';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { OrderDto } from './dtos/order.dto';
import { OrderItemEntity } from './order-item.entity';
import { OrderNoteEntity } from './order-note.entity';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  @Column({
    unique: true,
    type: 'integer',
    default: () => "nextval('order_id_seq')",
  })
  orderId!: number;

  @ManyToOne(() => UserEntity, (user) => user.orders, { nullable: true })
  user?: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items!: OrderItemEntity[];

  @Column({ type: 'enum', default: OrderChannel.OTHER, enum: OrderChannel })
  orderChannel!: OrderChannel;

  @Column({ type: 'enum', default: OrderStatus.PENDING, enum: OrderStatus })
  status!: OrderStatus;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  alternatePhoneNumber?: string | null;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @OneToMany(() => OrderNoteEntity, (note) => note.order)
  notes?: OrderNoteEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee?: number;
}
