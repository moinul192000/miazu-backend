import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiFile, Auth, UUIDParam } from '../../decorators';
import { IFile } from '../../interfaces';
import { CreateProductDto } from './dtos/create-product.dto';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { ProductDto } from './dtos/product.dto';
import { ProductPageOptionsDto } from './dtos/product-page-options.dto';
import { ProductWithVariantDto } from './dtos/product-with-variant.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'Create Product',
    description: 'Create Product using product details',
  })
  @ApiCreatedResponse({ type: ProductDto, description: 'Product Created' })
  @ApiFile({ name: 'thumbnail' })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: IFile,
  ) {
    const entity = await this.productService.createProduct(
      createProductDto,
      file,
    );

    return entity.toDto();
  }

  // Create Product Variant
  @Post('variants')
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'Create Product Variant',
    description: 'Create Product Variant using product id',
  })
  @ApiCreatedResponse({
    type: ProductWithVariantDto,
    description: 'Product Variant Created Successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createProductVariant(
    @Body() createProductVariantDto: CreateProductVariantDto,
  ) {
    const entity = await this.productService.createProductVariant(
      createProductVariantDto,
    );

    return entity.toDto();
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllProduct(
    @Query() productPageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    return this.productService.getAllProduct(productPageOptionsDto);
  }

  @Get('logs/:id')
  @Auth([RoleType.ADMIN])
  @ApiOperation({
    summary: 'Stock Adjustment Log By Product',
    description: 'Get Stock Adjustment Log By Product',
  })
  @HttpCode(HttpStatus.OK)
  async getStockAdjustmentLogByProduct(@Param('id') id: string) {
    return this.productService.getStockAdjustmentLogByProductId(id as Uuid);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleProduct(
    @UUIDParam('id') id: Uuid,
  ): Promise<ProductWithVariantDto> {
    return this.productService.getSingleProductWithVariants(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  updateProduct(
    @UUIDParam('id') id: Uuid,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<void> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteProduct(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
