import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
// import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderItemEntity } from './order-item.entity';
import { OrderItemReturnEntity } from './order-item-return.entity';
import { OrderNoteEntity } from './order-note.entity';
import { ReturnController } from './return.controller';
import { ReturnEntity } from './return.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ReturnEntity,
      OrderNoteEntity,
      OrderItemReturnEntity,
    ]),
    forwardRef(() => ProductModule),
    forwardRef(() => UserModule),
    forwardRef(() => CustomerModule),
  ],
  providers: [OrderService],
  controllers: [OrderController, ReturnController],
  exports: [OrderService],
})
export class OrderModule {}
