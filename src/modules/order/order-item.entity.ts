import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { ProductVariantEntity } from '../product/product-variant.entity';
import { OrderItemDto } from './dtos/order-item.dto';
import { OrderEntity } from './order.entity';
import { ReturnEntity } from './return.entity';

@Entity({ name: 'order_item' })
@UseDto(OrderItemDto)
export class OrderItemEntity extends AbstractEntity<OrderItemDto> {
  @ManyToOne(() => OrderEntity, (order) => order.items)
  order!: OrderEntity;

  @ManyToOne(() => ProductVariantEntity, (variant) => variant.orderItems)
  productVariant!: ProductVariantEntity;

  @Column({ default: 1, type: 'int' })
  quantity!: number;

  @Column({ type: 'float' })
  price!: number;

  @OneToMany(() => ReturnEntity, (ret) => ret.orderItems)
  returns!: ReturnEntity[];
}
