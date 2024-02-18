import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { StringFieldOptional } from '../../../decorators';

export class CustomersPageOptionsDto extends PageOptionsDto {
  @StringFieldOptional({
    description: 'Filter by Customer Name',
    example: 'Customer Name',
    title: 'Customer Name',
  })
  readonly customerName?: string;

  @StringFieldOptional({
    description: 'Filter by phone number',
    example: '1234567890',
    title: 'Phone number',
  })
  readonly phoneNumber?: string;

  @StringFieldOptional({
    description: 'Filter by Address',
    example: 'Address',
    title: 'Address',
  })
  readonly address?: string;
}
