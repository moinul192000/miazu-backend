import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from '../product/product.module';
// import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderItemEntity } from './order-item.entity';
import { OrderNoteEntity } from './order-note.entity';
import { ReturnEntity } from './return.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ReturnEntity,
      OrderNoteEntity,
    ]),
    forwardRef(() => ProductModule),
  ],
  providers: [OrderService],
  controllers: [],
})
export class OrderModule {}
