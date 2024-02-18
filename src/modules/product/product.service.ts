import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { type PageDto } from '../../common/dto/page.dto';
import { type OrderItemEntity } from '../order/order-item.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { type ProductDto } from './dtos/product.dto';
import { type ProductPageOptionsDto } from './dtos/product-page-options.dto';
import { type UpdateProductDto } from './dtos/update-product.dto';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { ProductEntity } from './product.entity';
import { ProductVariantEntity } from './product-variant.entity';
import { StockAdjustmentLogEntity } from './stock-adjustment-log.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: Repository<ProductVariantEntity>,
    @InjectRepository(StockAdjustmentLogEntity)
    private stockAdjustmentLogRepository: Repository<StockAdjustmentLogEntity>,
  ) {}

  @Transactional()
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const productEntity = this.productRepository.create(createProductDto);

    return this.productRepository.save(productEntity);
  }

  // Create Product Variant using product id
  @Transactional()
  async createProductVariant(
    createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductEntity> {
    const { productId } = createProductVariantDto;
    const productEntity = await this.getSingleProduct(productId);

    const productVariantEntity = this.productVariantRepository.create(
      createProductVariantDto,
    );

    productVariantEntity.product = productEntity;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!productEntity.variants) {
      productEntity.variants = [];
    }

    productEntity.variants.push(productVariantEntity);

    await this.productVariantRepository.save(productVariantEntity);

    return productEntity;
  }

  async getAllProduct(
    productPageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    // .leftJoinAndSelect('product.translations', 'productTranslation');
    const [items, pageMetaDto] = await queryBuilder.paginate(
      productPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getSingleProduct(id: Uuid): Promise<ProductEntity> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id });

    const productEntity = await queryBuilder.getOne();

    if (!productEntity) {
      throw new ProductNotFoundException();
    }

    return productEntity;
  }

  // Get single product with variants
  async getSingleProductWithVariants(id: Uuid): Promise<ProductEntity> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'productVariant')
      .where('product.id = :id', { id });

    const productEntity = await queryBuilder.getOne();

    if (!productEntity) {
      throw new ProductNotFoundException();
    }

    return productEntity;
  }

  async updateProduct(
    id: Uuid,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id });

    const productEntity = await queryBuilder.getOne();

    if (!productEntity) {
      throw new ProductNotFoundException();
    }

    this.productRepository.merge(productEntity, updateProductDto);

    await this.productRepository.save(updateProductDto);
  }

  async deleteProduct(id: Uuid): Promise<void> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id });

    const productEntity = await queryBuilder.getOne();

    if (!productEntity) {
      throw new ProductNotFoundException();
    }

    await this.productRepository.remove(productEntity);
  }

  // Get all product variants with stock
  async getAllProductsWithVariants() {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .getMany();
  }

  // Adjust stock level of a specific product variant with log
  @Transactional()
  async adjustStock(
    sku: string,
    adjustmentAmount: number,
    adjustedBy: string,
    reason?: string,
  ): Promise<void> {
    if (adjustmentAmount === 0) {
      throw new BadRequestException('Adjustment amount cannot be zero');
    }

    const productVariant = await this.productVariantRepository.findOne({
      where: { sku },
    });

    if (!productVariant) {
      throw new BadRequestException('Product variant not found');
    }

    const previousStockLevel = productVariant.stockLevel;

    const newStockLevel = previousStockLevel + adjustmentAmount;

    if (newStockLevel < 0) {
      throw new BadRequestException('Stock level cannot be less than zero');
    }

    // Update the stock level
    productVariant.stockLevel = newStockLevel;
    await this.productVariantRepository.save(productVariant);

    // Create a stock adjustment log
    const stockAdjustmentLog = new StockAdjustmentLogEntity();
    stockAdjustmentLog.previousStockLevel = previousStockLevel;
    stockAdjustmentLog.adjustmentAmount = adjustmentAmount;
    stockAdjustmentLog.adjustmentDate = new Date();
    stockAdjustmentLog.adjustedBy = adjustedBy;
    stockAdjustmentLog.productVariant = productVariant;
    stockAdjustmentLog.reason = reason;

    await this.stockAdjustmentLogRepository.save(stockAdjustmentLog);
  }

  // Get product variant by ids
  // Required for creating order
  async getVariantByIds(
    productVariantIds: Uuid[],
  ): Promise<ProductVariantEntity[]> {
    return this.productVariantRepository.find({
      where: {
        id: In(productVariantIds),
      },
    });
  }

  // Deduct stock level of product variants from orderItems
  async deductStockFromOrder(
    orderItems: OrderItemEntity[],
    reason = 'Order Placed',
  ): Promise<void> {
    try {
      await Promise.all(
        orderItems.map(async (orderItem) => {
          const variant = await this.productVariantRepository.findOneByOrFail({
            id: orderItem.productVariant.id,
          });

          // Ensure sufficient stock before deduction
          if (variant.stockLevel < orderItem.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product variant: ${variant.sku}`,
            );
          }

          variant.stockLevel -= orderItem.quantity;
          await this.productVariantRepository.save(variant);

          // Create Stock Adjustment Log
          // const log = new StockAdjustmentLogEntity();
          // log.previousStockLevel = variant.stockLevel + orderItem.quantity;
          // log.productVariant = variant;
          // log.adjustmentAmount = -orderItem.quantity;
          // log.adjustmentDate = new Date();
          // log.adjustedBy = 'Order-Service';
          // log.reason = reason;
          // await this.stockAdjustmentLogRepository.save(log);
        }),
      );
      // eslint-disable-next-line no-console
      console.log('Stock deducted', reason);
      //TODO: Fix callstack issue
    } catch {
      throw new InternalServerErrorException('Error deducting stock');
    }
  }
}
