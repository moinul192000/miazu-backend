import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { CreateAdminOrderDto } from './dtos/create-admin-order.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/admin/create')
  @HttpCode(HttpStatus.CREATED)
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

  // @Get()
  // async getAllOrders() {
  //   return this.orderService.getAllOrders();
  // }
}
