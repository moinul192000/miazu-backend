import { Injectable } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { Transactional } from 'typeorm-transactional';
import { type PageDto } from '../../common/dto/page.dto';
// import { ValidatorService } from '../../shared/services/validator.service';
// import { CreateProductDto } from './dtos/create-product.dto';
import { type ProductDto } from './dtos/product.dto';
import { type ProductPageOptionsDto } from './dtos/product-page-options.dto';
import { type UpdateProductDto } from './dtos/update-product.dto';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    // private validatorService: ValidatorService,
    // private commandBus: CommandBus,
  ) {}

  // @Transactional()
  // createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
  //   return this.commandBus.execute<CreateProductCommand, ProductEntity>(
  //     new CreateProductCommand(createProductDto),
  //   );
  // }

  async getAllProduct(
    productPageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.translations', 'productTranslation');
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
}
