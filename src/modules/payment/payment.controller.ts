import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentEntity } from './payment.entity';
import { PaymentService } from './payment.service';

@Controller('payments')
@ApiTags('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: PaymentEntity,
    description: 'Created payment',
  })
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get('order/:orderId')
  @ApiResponse({
    status: 200,
    type: PaymentEntity,
    isArray: true,
    description: 'Get payments by order id',
  })
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  getPaymentsByOrder(
    @Param('orderId') orderId: number,
  ): Promise<PaymentEntity[]> {
    return this.paymentService.getPaymentsByOrderId(orderId);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: PaymentEntity,
    description: 'Get payment by id',
  })
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
  @ApiResponse({
    status: 204,
    description: 'Deleted payment',
  })
  @Auth([RoleType.ADMIN])
  remove(@Param('id') id: Uuid) {
    return this.paymentService.deletePayment(id);
  }
}
