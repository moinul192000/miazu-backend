import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { Auth, UUIDParam } from '../../decorators';
import { CreateProductDto } from './dtos/create-product.dto';
import { type ProductDto } from './dtos/product.dto';
import { ProductPageOptionsDto } from './dtos/product-page-options.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    // eslint-disable-next-line no-console
    console.log(createProductDto);
    // Dummy await
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // const entity = await this.productService.createProduct(createProductDto);

    // return entity.toDto();
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllProduct(
    @Query() productPageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    return this.productService.getAllProduct(productPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleProduct(@UUIDParam('id') id: Uuid): Promise<ProductDto> {
    const entity = await this.productService.getSingleProduct(id);

    return entity.toDto();
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
