import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { type PaymentEntity } from './payment.entity';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get('order/:orderId')
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  getPaymentsByOrder(
    @Param('orderId') orderId: number,
  ): Promise<PaymentEntity[]> {
    return this.paymentService.getPaymentsByOrderId(orderId);
  }

  @Get(':id')
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  findOne(@Param('id') id: Uuid): Promise<PaymentEntity> {
    return this.paymentService.getPayment(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateData: Partial<CreatePaymentDto>,
  // ): Promise<PaymentEntity> {
  //   return this.paymentService.updatePayment(id, updateData);
  // }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  remove(@Param('id') id: Uuid) {
    return this.paymentService.deletePayment(id);
  }
}
