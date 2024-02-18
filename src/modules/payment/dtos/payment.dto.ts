import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PaymentMethod } from '../../../constants';
import { Trim } from '../../../decorators';
import { type PaymentEntity } from '../payment.entity';

export class PaymentDto extends AbstractDto {
  orderId: string;

  @IsNumber()
  amount: number;

  @IsEnum(() => PaymentMethod)
  method: PaymentMethod;

  @IsDateString()
  transactionDate?: Date;

  @IsString()
  transactionId?: string;

  @IsString()
  @Trim()
  note?: string;

  constructor(payment: PaymentEntity) {
    super(payment);
    this.orderId = payment.order.id;
    this.amount = payment.amount;
    this.method = payment.method;
    this.transactionDate = payment.transactionDate;
    this.transactionId = payment.transactionId;
    this.note = payment.note;
  }
}
