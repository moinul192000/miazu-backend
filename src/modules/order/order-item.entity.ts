import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { ProductVariantEntity } from '../product/product-variant.entity';
import { OrderItemDTO } from './dtos/order-item.dto';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_item' })
@UseDto(OrderItemDTO)
export class OrderItemEntity extends AbstractEntity<OrderItemDTO> {
  @ManyToOne(() => OrderEntity, (order) => order.items)
  order!: OrderEntity;

  @ManyToOne(() => ProductVariantEntity, (variant) => variant.orderItems)
  productVariant!: ProductVariantEntity;

  @Column({ default: 1, type: 'int' })
  quantity!: number;

  @Column({ type: 'float' })
  price!: number;
}
