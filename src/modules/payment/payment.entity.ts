import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PaymentMethod } from '../../constants';
import { UseDto } from '../../decorators';
import { OrderEntity } from '../order/order.entity';
import { PaymentDto } from './dtos/payment.dto';

@Entity({ name: 'payments' })
@UseDto(PaymentDto)
export class PaymentEntity extends AbstractEntity<PaymentDto> {
  @ManyToOne(() => OrderEntity, (order) => order.payments)
  order!: OrderEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method!: PaymentMethod;

  @Column({ type: 'timestamptz', nullable: true })
  transactionDate?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
