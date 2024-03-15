import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OrderChannel, OrderStatus, PaymentStatus } from '../../constants';
import { UseDto } from '../../decorators';
import { CustomerEntity } from '../customer/customer.entity';
import { PaymentEntity } from '../payment/payment.entity';
import { UserEntity } from '../user/user.entity';
import { OrderDto } from './dtos/order.dto';
import { OrderItemEntity } from './order-item.entity';
import { OrderNoteEntity } from './order-note.entity';
import { ReturnEntity } from './return.entity';

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

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    nullable: true,
  })
  customer?: CustomerEntity;

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

  @Column({ type: 'enum', default: PaymentStatus.PENDING, enum: PaymentStatus })
  paymentStatus!: PaymentStatus;

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments?: PaymentEntity[];

  @OneToOne(() => ReturnEntity, (returnOrder) => returnOrder.order, {
    nullable: true,
  })
  returnOrder?: ReturnEntity;

  @OneToOne(
    () => ReturnEntity,
    (exchangeOrder) => exchangeOrder.exchangeOrder,
    { nullable: true },
  )
  exchangeOrder?: ReturnEntity;
}
