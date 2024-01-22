import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderStatus } from '../../../constants/order-status';
import { ApiEnumProperty, ApiUUIDProperty } from '../../../decorators';
import { type OrderEntity } from '../order.entity';
import { OrderItemDTO } from './order-item.dto';

export class OrderDto extends AbstractDto {
  @ApiUUIDProperty({
    description: 'User UUID',
    example: 'b3d5e6c0-1e47-11ec-9621-0242ac130002',
  })
  user!: string;

  @ApiProperty({
    description: 'Order items',
    isArray: true,
    type: [OrderItemDTO],
  })
  items!: OrderItemDTO[];

  @ApiEnumProperty(() => OrderStatus, {
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    default: OrderStatus.PENDING,
    description: 'Order status',
  })
  status!: OrderStatus;

  constructor(orderEntity: OrderEntity) {
    super(orderEntity);
    this.user = orderEntity.user.id;
    this.items = orderEntity.items.map((item) => new OrderItemDTO(item));
    this.status = orderEntity.status;
  }
}
