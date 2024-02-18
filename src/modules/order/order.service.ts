import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { type PageDto } from '../../common/dto/page.dto';
import { type PaymentStatus } from '../../constants';
import { type PaymentEntity } from '../payment/payment.entity';
import { ProductService } from '../product/product.service';
import { type ProductVariantEntity } from '../product/product-variant.entity';
import { UserService } from '../user/user.service';
import { CreateAdminOrderDto } from './dtos/create-admin-order.dto';
import { type CreateOrderItemDto } from './dtos/create-order-item.dto';
import { type OrderDto } from './dtos/order.dto';
import { type OrdersPageOptionsDto } from './dtos/orders-page-options.dto';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  private validateStockAvailability(
    orderItems: CreateOrderItemDto[],
    productVariants: ProductVariantEntity[],
  ) {
    for (const orderItem of orderItems) {
      const matchingVariant = productVariants.find(
        (v) => v.id === orderItem.productVariantId,
      );

      if (matchingVariant && matchingVariant.stockLevel < orderItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product variant (ID: ${matchingVariant.sku})`,
        );
      }
    }
  }

  // Create a new order
  @Transactional()
  async createAdminOrder(
    createAdminOrderDto: CreateAdminOrderDto,
  ): Promise<OrderEntity> {
    const productVariants = await this.productService.getVariantByIds(
      createAdminOrderDto.items.map((item) => item.productVariantId),
    );

    if (productVariants.length !== createAdminOrderDto.items.length) {
      throw new NotFoundException('One or more product variants not found');
    }

    // check stock for each product variant and throw error if not enough stock
    this.validateStockAvailability(createAdminOrderDto.items, productVariants);

    const order = new OrderEntity();
    const validUser = await this.userService.findOne({
      id: createAdminOrderDto.userId,
    });

    if (!validUser) {
      throw new NotFoundException('User not found');
    }

    order.user = validUser;
    order.phoneNumber = createAdminOrderDto.phoneNumber;
    order.address = createAdminOrderDto.address;

    // Check optional fields
    if (createAdminOrderDto.alternatePhoneNumber) {
      order.alternatePhoneNumber = createAdminOrderDto.alternatePhoneNumber;
    }

    if (createAdminOrderDto.status) {
      order.status = createAdminOrderDto.status;
    }

    if (createAdminOrderDto.orderChannel) {
      order.orderChannel = createAdminOrderDto.orderChannel;
    }

    // Create order items
    order.items = await Promise.all(
      createAdminOrderDto.items.map(async (item) => {
        const orderItem = new OrderItemEntity();
        const variant = productVariants.find(
          (v) => v.id === item.productVariantId,
        );

        orderItem.productVariant = variant!;
        orderItem.quantity = item.quantity;
        orderItem.price = 10;
        orderItem.order = order;

        return this.orderItemRepository.save(orderItem);
      }),
    );

    try {
      return await this.orderRepository.save(order);
    } catch {
      throw new InternalServerErrorException('Error creating order');
    }
  }

  // Deduct stock level of product variants from orderItems
  async deductStockFromOrder(
    orderItems: OrderItemEntity[],
    orderId: number,
  ): Promise<void> {
    await this.productService.deductStockFromOrder(
      orderItems,
      `Order-${orderId}`,
    );
  }

  // Get all orders
  async getAllOrders(
    pageOptionsDto: OrdersPageOptionsDto,
  ): Promise<PageDto<OrderDto>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.items', 'items')
      .leftJoinAndSelect('items.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .select('orders')
      .addSelect(['items.id', 'items.quantity', 'items.price'])
      .addSelect([
        'productVariant.sku',
        'productVariant.size',
        'productVariant.color',
      ])
      .addSelect(['product.name', 'product.brand']);

    // Handle optional filters
    if (pageOptionsDto.productName) {
      queryBuilder.andWhere('product.name LIKE :productName', {
        productName: `%${pageOptionsDto.productName}%`,
      });
    }

    if (pageOptionsDto.sku) {
      queryBuilder.andWhere('productVariant.sku LIKE :sku', {
        sku: `%${pageOptionsDto.sku}%`,
      });
    }

    if (pageOptionsDto.address) {
      queryBuilder.andWhere('orders.address LIKE :address', {
        address: `%${pageOptionsDto.address}%`,
      });
    }

    if (pageOptionsDto.phoneNumber) {
      queryBuilder.andWhere('orders.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${pageOptionsDto.phoneNumber}%`,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  // Get order by ID
  async getOrderById(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: {
        orderId: id,
      },
      relations: ['items', 'items.productVariant', 'items.productVariant'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Helper function to calculate total amount of an order
  getOrderTotalAmount(order: OrderEntity): number {
    const totalAmount = order.items.reduce(
      (total: number, item: OrderItemEntity) =>
        total + item.price * item.quantity,
      0,
    );

    return totalAmount + (order.deliveryFee ?? 0) - (order.discount ?? 0);
  }

  getOrderTotalPaid(order: OrderEntity): number {
    return (
      order.payments?.reduce(
        (total: number, payment: PaymentEntity) => total + payment.amount,
        0,
      ) ?? 0
    );
  }

  getOrderTotalDue(order: OrderEntity): number {
    return this.getOrderTotalAmount(order) - this.getOrderTotalPaid(order);
  }

  async updateOrderPaymentStatus(orderId: string, status: PaymentStatus) {
    const result = await this.orderRepository.update(orderId, {
      paymentStatus: status,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Order not found');
    }
  }
}
