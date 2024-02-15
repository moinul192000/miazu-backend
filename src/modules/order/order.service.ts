import {
  Injectable,
  // InternalServerErrorException,
  // NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { Transactional } from 'typeorm-transactional';
// import { OrderStatus } from '../../constants/order-status';
// import { ProductService } from '../product/product.service';
// import { type UserEntity } from '../user/user.entity';
import { OrderEntity } from './order.entity';
// import { OrderItemEntity } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    // @InjectRepository(OrderItemEntity)
    // private orderItemRepository: Repository<OrderItemEntity>,
    // private productService: ProductService,
  ) {}

  // Get all orders
  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }
}
