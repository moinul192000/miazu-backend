import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ReturnReason } from '../../../constants';
import { type ReturnEntity } from '../return.entity';
import { OrderItemDto } from './order-item.dto';

export class ReturnDto extends AbstractDto {
  @Type(() => OrderItemDto)
  @IsArray()
  @ValidateNested({ each: true }) // Add for nested array validation
  orderItems: OrderItemDto[]; // Plural 'orderItems' to match the Entity

  @IsNumber()
  @IsPositive()
  quantityReturned: number;

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

  constructor(returnEntity: ReturnEntity) {
    super(returnEntity);
    this.orderItems = returnEntity.orderItems.map(
      (item) => new OrderItemDto(item),
    );
    this.quantityReturned = returnEntity.quantityReturned;
    this.reason = returnEntity.reason;
    this.restockingFee = returnEntity.restockingFee;
    this.isReturned = returnEntity.isReturned;
    this.isExchange = returnEntity.isExchange;
  }
}
