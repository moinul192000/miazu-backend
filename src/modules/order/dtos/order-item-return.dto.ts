import { IsNumber, IsPositive, IsUUID } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { type OrderItemReturnEntity } from '../order-item-return.entity';

export class OrderItemReturnDto extends AbstractDto {
  @IsUUID()
  orderItemId!: Uuid;

  @IsNumber()
  @IsPositive()
  returnQuantity!: number;

  constructor(returnItem: OrderItemReturnEntity) {
    super(returnItem);
    this.orderItemId = returnItem.orderItem.id;
    this.returnQuantity = returnItem.returnQuantity;
  }
}
