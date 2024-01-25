import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from '../product/product.module';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderItemEntity } from './order-item.entity';
import { OrderLogEntity } from './order-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, OrderLogEntity]),
    forwardRef(() => ProductModule),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
