import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CreateAdminOrderDto } from './dtos/create-admin-order.dto';
import { CreateFastOrderDto } from './dtos/create-fast-order.dto';
import { OrdersPageOptionsDto } from './dtos/orders-page-options.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/admin/create')
  @HttpCode(HttpStatus.CREATED)
  @Auth([RoleType.ADMIN])
  @ApiCreatedResponse({
    description: 'Order created successfully',
  })
  @ApiBody({ type: CreateAdminOrderDto })
  async createAdminOrder(@Body() createOrderDto: CreateAdminOrderDto) {
    const order = await this.orderService.createAdminOrder(createOrderDto);

    if (order.id) {
      await this.orderService.deductStockFromOrder(order.items, order.orderId);

      return order;
    }
  }

  @Post('admin/fast-create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Order created successfully',
  })
  @Auth([RoleType.ADMIN])
  @ApiBody({ type: CreateFastOrderDto })
  async fastCreateAdminOrder(@Body() createFastOrderDto: CreateFastOrderDto) {
    const order = await this.orderService.createFastOrder(createFastOrderDto);

    if (order.id) {
      await this.orderService.deductStockFromOrder(order.items, order.orderId);

      return order;
    }
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
