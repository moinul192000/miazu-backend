import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiUUIDProperty } from '../../../decorators';
import { type OrderItemEntity } from '../order-item.entity';

export class OrderItemDTO extends AbstractDto {
  @ApiUUIDProperty({
    description: 'Order Item UUID',
    example: 'b3d5e6c0-1e47-11ec-9621-0242ac130002',
  })
  orderId: string;

  @ApiUUIDProperty({
    description: 'Product Variant UUID',
    example: 'b3d5e6c0-1e47-11ec-9621-0242ac130002',
  })
  productVariantId: string;

  @ApiProperty({
    description: 'Order Item quantity',
    example: 1,
    type: Number,
    minimum: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Order Item price',
    example: 100,
    type: Number,
    minimum: 0,
  })
  price: number;

  constructor(orderItem: OrderItemEntity) {
    super(orderItem);
    this.orderId = orderItem.order.id;
    this.productVariantId = orderItem.productVariant.id;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
  }
}
