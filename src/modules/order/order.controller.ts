import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type';
import { Auth, AuthUser } from '../../decorators/';
import { UserEntity } from '../user/user.entity';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderDto } from './dtos/order.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OrderDto, description: 'Successfully Registered' })
  @Auth([RoleType.USER, RoleType.ADMIN])
  async createOrder(
    @AuthUser() user: UserEntity,
    @Body() createOrderDto: CreateOrderDTO,
  ): Promise<OrderDto> {
    const createdOrder = await this.orderService.createOrder(
      createOrderDto,
      user,
    );

    return createdOrder.toDto();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [OrderDto], description: 'Get all orders' })
  async getOrders(): Promise<OrderDto[]> {
    const orders = await this.orderService.getOrders();

    return orders.map((order) => order.toDto());
  }
}
