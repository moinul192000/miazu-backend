import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { ProductService } from '../product/product.service';
import { CreateAdminOrderDto } from './dtos/create-admin-order.dto';
import { CreateFastOrderDto } from './dtos/create-fast-order.dto';
import { OrdersPageOptionsDto } from './dtos/orders-page-options.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  @Post('/admin/create')
  @HttpCode(HttpStatus.CREATED)
  @Auth([RoleType.ADMIN])
  @ApiCreatedResponse({
    description: 'Order created successfully',
  })
  @ApiBody({ type: CreateAdminOrderDto })
  async createAdminOrder(@Body() createOrderDto: CreateAdminOrderDto) {
    return this.orderService.createAdminOrder(createOrderDto);
  }

  @Post('/admin/fast-create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Order created successfully',
  })
  @Auth([RoleType.ADMIN])
  @ApiBody({ type: CreateFastOrderDto })
  async fastCreateAdminOrder(@Body() createFastOrderDto: CreateFastOrderDto) {
    const order = await this.orderService.createFastOrder(createFastOrderDto);

    if (order.orderId) {
      await this.productService.deductStockFromOrder(
        order.items,
        `Order-${order.orderId}`,
      );
    }

    return order.orderId;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all orders',
  })
  @Auth([RoleType.ADMIN])
  async getAllOrders(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: OrdersPageOptionsDto,
  ) {
    return this.orderService.getAllOrders(pageOptionsDto);
  }
}
