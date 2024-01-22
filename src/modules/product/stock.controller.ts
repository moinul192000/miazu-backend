import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '../../decorators';
import { type ProductWithVariantDto } from './dtos/product-with-variant.dto';
import { UpdateStockDto } from './dtos/update-stock.dto';
import { ProductService } from './product.service';

@Controller('stocks')
@ApiTags('stocks')
export class StockController {
  constructor(private productService: ProductService) {}

  @Get()
  @Auth([])
  @ApiOperation({
    summary: 'All Product with Variant',
    description: 'Get All Product Variant With Stock',
  })
  @HttpCode(HttpStatus.OK)
  async getAllProduct(): Promise<ProductWithVariantDto[]> {
    return this.productService.getAllProductsWithVariants();
  }

  // Adjust stock level of a specific product variant
  // @Patch(':productId/variants/:productVariantId/stock')

  @Post('adjust/:sku')
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
  ): Promise<void> {
    await this.productService.adjustStock(
      sku,
      updateStockDto.adjustmentAmount,
      updateStockDto.adjustedBy,
      updateStockDto.reason,
    );
  }
}
