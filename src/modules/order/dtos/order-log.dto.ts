import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderEntity } from '../order.entity';
import { type OrderLogEntity } from '../order-log.entity';

export class OrderLogDto extends AbstractDto {
  @ApiProperty({
    description: 'Order',
    type: OrderEntity,
  })
  order!: OrderEntity;

  @ApiProperty({
    description: 'Order adjustment description',
    example: 'Order status changed to PENDING',
    type: String,
  })
  description!: string;

  constructor(orderLogEntity: OrderLogEntity) {
    super(orderLogEntity);
    this.order = orderLogEntity.order;
    this.description = orderLogEntity.description;
  }
}
