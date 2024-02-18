import { PaymentMethod } from '../../../constants/payment-method';
import {
  DateFieldOptional,
  EnumField,
  NumberField,
  StringFieldOptional,
} from '../../../decorators';

export class CreatePaymentDto {
  @NumberField({ required: true, description: 'Order ID' })
  orderId!: number;

  @NumberField({ required: true, description: 'Amount' })
  amount!: number;

  @EnumField(() => PaymentMethod, {
    required: true,
    description: 'Payment Method',
  })
  method!: PaymentMethod;

  @StringFieldOptional({ description: 'Transaction ID' })
  transactionId?: string;

  @DateFieldOptional({ description: 'Transaction Date' })
  transactionDate?: Date;

  @StringFieldOptional({ description: 'Note' })
  note?: string;
}
