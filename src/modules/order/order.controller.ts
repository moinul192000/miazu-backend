import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
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
import { CreateReturnDto } from './dtos/create-return.dto';
import { OrderDto } from './dtos/order.dto';
import { OrdersPageOptionsDto } from './dtos/orders-page-options.dto';
// import { type OrderEntity } from './order.entity';
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

  @Get(':id')
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a Order Details by ID',
    type: OrderDto,
  })
  getOrder(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('ID must be provided');
    }

    return this.orderService.getOrderDetails(id);
  }

  @Post(':id/return')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Return created successfully',
  })
  async createReturn(
    @Param('id') id: number,
    @Body() createReturnDto: CreateReturnDto,
  ) {
    return this.orderService.createReturn(id, createReturnDto);
  }

  // Get all returns for a specific order
  // @Get(':id/returns')
  // @Auth([RoleType.ADMIN])
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Get all returns for a specific order',
  // })
  // async getReturns(@Param('id') id: number) {
  //   return this.orderService.getReturns(id);
  // }

  // Get order by product variant
  @Get('product-variant/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get order by product variant',
  })
  async getOrderByProductVariant(@Param('id') id: Uuid) {
    return this.orderService.getOrdersByProductVariant(id);
  }
}
