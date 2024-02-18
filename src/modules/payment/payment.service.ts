import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentStatus } from '../../constants';
import { OrderService } from '../order/order.service';
import { type CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentEntity } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentEntity> {
    const order = await this.orderService.getOrderById(
      createPaymentDto.orderId,
    );

    const dueAmount = this.orderService.getOrderTotalDue(order);

    if (createPaymentDto.amount > dueAmount) {
      throw new NotFoundException('Payment amount exceeds due amount');
    }

    const newPayment = this.paymentRepository.create({
      order,
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      transactionDate: createPaymentDto.transactionDate,
      transactionId: createPaymentDto.transactionId,
      note: createPaymentDto.note,
    });

    const status =
      dueAmount - createPaymentDto.amount === 0
        ? PaymentStatus.PAID
        : PaymentStatus.PARTIALLY_PAID;

    await this.orderService.updateOrderPaymentStatus(order.id, status);

    return this.paymentRepository.save(newPayment);
  }

  async deletePayment(paymentId: Uuid) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const result = await this.paymentRepository.delete(paymentId);

    if (result.affected === 0) {
      throw new NotFoundException('Payment not found');
    }

    await this.orderService.updateOrderPaymentStatus(
      payment.order.id,
      PaymentStatus.PARTIALLY_PAID,
    );
  }

  async getPayment(id: Uuid): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentsByOrderId(orderId: number): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      where: { order: { orderId } },
    });
  }
}
