import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { OrderStatus } from '../../constants/order-status';
import { ProductService } from '../product/product.service';
import { UserEntity } from '../user/user.entity';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    private productService: ProductService,
  ) {}

  @Transactional()
  async createOrder(
    createOrderDto: CreateOrderDTO,
    user: UserEntity,
  ): Promise<OrderEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new InternalServerErrorException('Order items are required');
    }

    // Extract product variant ids from order items
    const productVariantIds = createOrderDto.items.map(
      (item) => item.productVariantId as Uuid,
    );

    // Get product variants from database
    const productVariants =
      await this.productService.getProductVariantsByIds(productVariantIds);

    // Check each product variant is available in stock for the requested quantity
    const orderItems: OrderItemEntity[] = [];

    const order = this.orderRepository.create({
      user,
      ...createOrderDto,
      status: OrderStatus.PENDING,
    });

    for (const item of createOrderDto.items) {
      const productVariant = productVariants.find(
        (variant) => variant.id === item.productVariantId,
      );

      if (!productVariant) {
        throw new NotFoundException(
          `Product variant with id ${item.productVariantId} not found`,
        );
      }

      if (productVariant.stockLevel < item.quantity) {
        if (productVariant.stockLevel === 0) {
          throw new InternalServerErrorException(
            `Product SKU: ${productVariant.sku} is not available in stock`,
          );
        }

        throw new InternalServerErrorException(
          `Product SKU: ${productVariant.sku} has only ${productVariant.stockLevel} in stock`,
        );
      }

      const orderItem = this.orderItemRepository.create({
        order,
        productVariant,
        price: 10, // TODO: Calculate price based on product variant price
        quantity: item.quantity,
      });
      orderItems.push(orderItem);
      // TODO: Addjust stock level for each product variant
    }

    order.items = orderItems;
    await this.orderRepository.save(order);
    await this.orderItemRepository.save(order.items);

    return order;
  }

  async getOrders(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: [
        'items',
        'items.productVariant',
        'items.productVariant.product',
      ],
    });

    if (orders.length === 0) {
      throw new NotFoundException('Orders not found');
    }

    return orders;
  }
}
