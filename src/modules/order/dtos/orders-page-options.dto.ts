import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { OrderStatus } from '../../../constants';
import { EnumFieldOptional, StringFieldOptional } from '../../../decorators';

export class OrdersPageOptionsDto extends PageOptionsDto {
  @StringFieldOptional({
    description: 'Filter by phone number',
    example: '1234567890',
    title: 'Phone number',
  })
  readonly phoneNumber?: string;

  @StringFieldOptional({
    description: 'Filter by Product Name',
    example: 'Product Name',
    title: 'Product Name',
  })
  readonly productName?: string;

  @StringFieldOptional({
    description: 'Filter by SKU',
    example: 'SKU',
    title: 'SKU',
  })
  readonly sku?: string;

  @StringFieldOptional({
    description: 'Filter by Address',
    example: 'Address',
    title: 'Address',
  })
  readonly address?: string;

  @EnumFieldOptional(() => OrderStatus, {
    description: 'Filter by status',
    example: OrderStatus.PENDING,
    title: 'Status',
  })
  readonly status?: string;
}
