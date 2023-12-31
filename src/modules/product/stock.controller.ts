import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from '../../decorators';
import { type ProductWithVariantDto } from './dtos/product-with-variant.dto';
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
}
