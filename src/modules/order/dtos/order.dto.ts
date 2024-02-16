import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderChannel, OrderStatus } from '../../../constants';
import {
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { UserDto } from '../../user/dtos/user.dto';
import { type OrderEntity } from '../order.entity';
import { OrderItemDto } from './order-item.dto';
import { OrderNoteDto } from './order-note.dto';

export class OrderDto extends AbstractDto {
  @NumberField()
  orderId: number;

  @Type(() => UserDto)
  @IsOptional()
  user?: UserDto;

  @Type(() => OrderItemDto)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  items: OrderItemDto[];

  @EnumField(() => OrderChannel)
  orderChannel: OrderChannel;

  @EnumField(() => OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phoneNumber: string;

  @StringFieldOptional()
  alternatePhoneNumber?: string | null;

  @StringField()
  address: string;

  @Type(() => OrderNoteDto)
  @IsOptional()
  @ValidateNested({ each: true })
  notes?: OrderNoteDto[];

  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  discount?: number;

  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  deliveryCharge?: number;

  constructor(order: OrderEntity) {
    super(order);
    this.orderId = order.orderId;
    this.user = order.user && new UserDto(order.user);
    this.orderChannel = order.orderChannel;
    this.status = order.status;
    this.phoneNumber = order.phoneNumber;
    this.alternatePhoneNumber = order.alternatePhoneNumber;
    this.address = order.address;
    this.items = order.items.map((item) => new OrderItemDto(item));
    this.notes = order.notes?.map((note) => new OrderNoteDto(note));
    this.discount = order.discount;
    this.deliveryCharge = order.deliveryFee;
  }
}
