import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { AnalyticsService } from './analytics.service';
import { AnalyticsDto } from './dtos/analytics.dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all analytics',
    type: AnalyticsDto,
  })
  getAllAnalytics(): Promise<AnalyticsDto> {
    return this.analyticsService.getAllAnalytics();
  }

  @Get('product/sales')
  @UseInterceptors(CacheInterceptor)
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all product sales count by variant',
  })
  async getProductSales(): Promise<unknown> {
    return this.analyticsService.getProductOrderCountByVariant();
  }

  @Get('product/sales/summary')
  @UseInterceptors(CacheInterceptor)
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all product order count',
  })
  getProductOrderCount(): Promise<unknown> {
    return this.analyticsService.getTotalOrderByProduct();
  }
}
