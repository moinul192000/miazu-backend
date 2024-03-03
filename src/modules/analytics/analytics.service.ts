import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CustomerService } from '../customer/customer.service';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { type AnalyticsDto } from './dtos/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async getAllAnalytics(): Promise<AnalyticsDto> {
    const totalStocks = (await this.productService.getTotalStockLevel()) || 0;
    const totalCustomers =
      (await this.customerService.getTotalCustomers()) || 0;
    const totalOrders = (await this.orderService.getTotalOrders()) || 0;
    //const totalPaymentsValue = (await this.orderService.getTotalPaymentsValue()) || 0;

    return {
      totalStocks,
      totalCustomers,
      totalOrders,
      totalPaymentsValue: 0,
    };
  }
}