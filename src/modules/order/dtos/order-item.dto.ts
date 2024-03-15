import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ProductVariantDto } from '../../product/dtos/product-variant.dto';
import { type OrderItemEntity } from '../order-item.entity';
import { OrderItemReturnDto } from './order-item-return.dto';

export class OrderItemDto extends AbstractDto {
  @Type(() => ProductVariantDto)
  productVariant: ProductVariantDto;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @Type(() => OrderItemReturnDto)
  @ValidateNested({ each: true })
  itemReturns?: OrderItemReturnDto[];

  constructor(orderItem: OrderItemEntity) {
    super(orderItem);
    this.productVariant = new ProductVariantDto(orderItem.productVariant);
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
    this.itemReturns = orderItem.itemReturns.map(
      (itemReturn) => new OrderItemReturnDto(itemReturn),
    );
  }
}
