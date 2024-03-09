import { CacheModule } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';

import { CustomerModule } from '../customer/customer.module';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductModule } from '../product/product.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ProductModule),
    forwardRef(() => OrderModule),
    forwardRef(() => PaymentModule),
    CacheModule.register({
      ttl: 300_000, // 5 minutes
      max: 10,
    }),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
