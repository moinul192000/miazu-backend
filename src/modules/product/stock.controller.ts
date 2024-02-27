import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decorators';
import { UpdateStockDto } from './dtos/update-stock.dto';
import { ProductService } from './product.service';
// import { StockAdjustmentLogEntity } from './stock-adjustment-log.entity';

@Controller('stocks')
@ApiTags('stocks')
export class StockController {
  constructor(private productService: ProductService) {}

  @Get()
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'All Product with Variant',
    description: 'Get All Product Variant With Stock',
  })
  @HttpCode(HttpStatus.OK)
  async getAllProduct() {
    return this.productService.getAllProductsWithVariants();
  }

  @Patch('adjust/:sku')
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'Adjust the Product Stock Manually',
    description: 'Update the stock of a product variant by its SKU.',
  })
  @ApiCreatedResponse({
    description: 'Product stock adjustment successfull.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input, unable to update stock.',
  })
  @HttpCode(HttpStatus.CREATED)
  async updateStock(
    @Param('sku') sku: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<UpdateStockDto> {
    return this.productService.adjustStock(
      sku,
      updateStockDto.adjustmentAmount,
      updateStockDto.adjustedBy,
      updateStockDto.reason,
    );
  }

  @Get('logs')
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'Stock Adjustment Logs',
    description: 'Get All Stock Adjustment Logs',
  })
  @HttpCode(HttpStatus.OK)
  async getStockAdjustments() {
    return this.productService.getStockAdjustmentLogs();
  }

  // @Get('logs/:id')
  // @Auth([RoleType.ADMIN])
  // @ApiOperation({
  //   summary: 'Stock Adjustment Log',
  //   description: 'Get Stock Adjustment Log By Id',
  // })
  // @HttpCode(HttpStatus.OK)
  // async getStockAdjustmentLog(@Param('id') id: string) {
  //   return this.stockAdjustmentLogRepository.findOne(id);
  // }

  // Get logs by sku or variant id
  @Get('logs/:sku')
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'Stock Adjustment Log By SKU',
    description: 'Get Stock Adjustment Log By SKU',
  })
  @HttpCode(HttpStatus.OK)
  async getStockAdjustmentLogBySku(@Param('sku') sku: string) {
    return this.productService.getStockAdjustmentLogBySku(sku);
  }
}
