import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { OrderEntity } from '../order/order.entity';
import { CustomerDto } from './dtos/customer.dto';

@Entity({ name: 'customers' })
@UseDto(CustomerDto)
export class CustomerEntity extends AbstractEntity<CustomerDto> {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  alternatePhoneNumber?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  socialMediaId?: string | null;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders!: OrderEntity[];
}
