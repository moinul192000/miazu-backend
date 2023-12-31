import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { ProductVariantEntity } from './product-variant.entity';
import { StockController } from './stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductVariantEntity])],
  providers: [ProductService],
  controllers: [ProductController, StockController],
})
export class ProductModule {}
