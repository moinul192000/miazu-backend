import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { OrderNoteDto } from './dtos/order-note.dto';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_notes' })
@UseDto(OrderNoteDto)
export class OrderNoteEntity extends AbstractEntity<OrderNoteDto> {
  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => OrderEntity, (order) => order.notes)
  order!: OrderEntity;
}
