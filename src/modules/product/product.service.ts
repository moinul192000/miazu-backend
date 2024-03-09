import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { type PageDto } from '../../common/dto/page.dto';
import { type IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { type OrderItemEntity } from '../order/order-item.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { type ProductDto } from './dtos/product.dto';
import { type ProductPageOptionsDto } from './dtos/product-page-options.dto';
import { type UpdateProductDto } from './dtos/update-product.dto';
import { type UpdateStockDto } from './dtos/update-stock.dto';
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
    private s3Service: AwsS3Service,
  ) {}

  @Transactional()
  async createProduct(
    createProductDto: CreateProductDto,
    image: IFile | undefined,
  ): Promise<ProductEntity> {
    const productEntity = this.productRepository.create(createProductDto);

    if (image) {
      productEntity.thumbnailImageUrl = await this.s3Service.uploadImage(image);
    }

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
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.createdAt', 'DESC')
      .orderBy('product.code', 'ASC');
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
      .orderBy('productVariant.size', 'ASC')
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
      .orderBy(
        "CASE WHEN variant.size = 'S' THEN 1 " +
          "WHEN variant.size = 'M' THEN 2 " +
          "WHEN variant.size = 'L' THEN 3 " +
          "WHEN variant.size = 'XL' THEN 4 " +
          "WHEN variant.size = 'XXL' THEN 5 " +
          'ELSE 6 END',
        'ASC',
      )
      .getMany();
  }

  // Adjust stock level of a specific product variant with log
  @Transactional()
  async adjustStock(
    sku: string,
    adjustmentAmount: number,
    adjustedBy: string,
    reason?: string,
  ): Promise<UpdateStockDto> {
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
    stockAdjustmentLog.newStockLevel = newStockLevel;
    stockAdjustmentLog.adjustmentDate = new Date();
    stockAdjustmentLog.adjustedBy = adjustedBy;
    stockAdjustmentLog.productVariant = productVariant;
    stockAdjustmentLog.reason = reason;

    return this.stockAdjustmentLogRepository.save(stockAdjustmentLog);
  }

  // Required for creating order
  async getVariantByIds(
    productVariantIds: Uuid[],
  ): Promise<ProductVariantEntity[]> {
    return this.productVariantRepository.find({
      where: {
        id: In(productVariantIds),
      },
      relations: ['product'],
    });
  }

  // Deduct stock level of product variants from orderItems
  async deductStockFromOrder(
    orderItems: OrderItemEntity[],
    _reason = 'Order Placed',
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
    } catch {
      throw new InternalServerErrorException('Error deducting stock');
    }
  }

  // Get all stock adjustment logs
  async getStockAdjustmentLogs() {
    return this.stockAdjustmentLogRepository.find();
  }

  // Get stock adjustment logs by sku
  async getStockAdjustmentLogBySku(sku: string) {
    return this.stockAdjustmentLogRepository.find({
      where: { productVariant: { sku } },
    });
  }

  // Get stock adjustment logs by product id
  async getStockAdjustmentLogByProductId(productId: Uuid) {
    return this.stockAdjustmentLogRepository.find({
      where: { productVariant: { product: { id: productId } } },
    });
  }

  async getTotalStockLevel(): Promise<number | null> {
    // Get sum of stock level of all product variants
    const stockLevel:
      | {
          totalStockLevel: number;
        }
      | undefined = await this.productVariantRepository
      .createQueryBuilder('productVariant')
      .select('SUM(productVariant.stockLevel)', 'totalStockLevel')
      .getRawOne();

    return stockLevel?.totalStockLevel || 0;
  }

  async getTotalEstimatedStockValue(): Promise<number | null> {
    const stockValue:
      | {
          totalEstimatedStockValue: number;
        }
      | undefined = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .select(
        'SUM(variant.stockLevel * product.price)',
        'totalEstimatedStockValue',
      )
      .getRawOne();

    return stockValue?.totalEstimatedStockValue || 0;
  }
}
