import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ReturnReason } from '../../../constants';
import { type ReturnEntity } from '../return.entity';
import { OrderItemReturnDto } from './order-item-return.dto';

export class ReturnDto extends AbstractDto {
  @IsUUID()
  orderId!: string;

  @Type(() => OrderItemReturnDto)
  itemReturns: OrderItemReturnDto[];

  @IsEnum(ReturnReason)
  reason: ReturnReason;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  restockingFee?: number;

  @IsOptional()
  @IsBoolean()
  isReturned: boolean;

  @IsOptional()
  @IsBoolean()
  isExchange: boolean;

  @IsOptional()
  @IsUUID()
  exchangeOrderId?: string;

  constructor(returnEntity: ReturnEntity) {
    super(returnEntity);
    this.orderId = returnEntity.order.id;
    this.reason = returnEntity.reason;
    this.restockingFee = returnEntity.restockingFee;
    this.isReturned = returnEntity.isReturned;
    this.isExchange = returnEntity.isExchange;
    this.exchangeOrderId = returnEntity.exchangeOrder?.id;
    this.itemReturns = returnEntity.itemReturns.map(
      (itemReturn) => new OrderItemReturnDto(itemReturn),
    );
  }
}
