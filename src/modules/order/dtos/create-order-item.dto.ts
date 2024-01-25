import { IsNotEmpty, IsUUID } from 'class-validator';

import { NumberField } from '../../../decorators/';

export class CreateOrderItemDTO {
  @IsUUID()
  @IsNotEmpty()
  productVariantId!: string;

  @NumberField({
    description: 'Quantity of the product variant',
    example: 1,
    minimum: 1,
  })
  quantity!: number;
}
