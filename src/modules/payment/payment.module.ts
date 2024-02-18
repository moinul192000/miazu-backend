import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './payment.controller';
import { PaymentEntity } from './payment.entity';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class OrderModule {}
