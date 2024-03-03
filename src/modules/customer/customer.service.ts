import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type PageDto } from '../../common/dto/page.dto';
import { CustomerEntity } from './customer.entity';
import { type CreateCustomerDto } from './dtos/create-customer.dto';
import { type CustomerDto } from './dtos/customer.dto';
import { type CustomersPageOptionsDto } from './dtos/customers-page-options.dto';
import { type UpdateCustomerDto } from './dtos/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(
    customerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = this.customerRepository.create(customerDto);

    return this.customerRepository.save(customer);
  }

  async findAllCustomers(): Promise<CustomerEntity[]> {
    return this.customerRepository.find();
  }

  async findCustomerById(id: Uuid): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findCustomersByName(name: string): Promise<CustomerEntity[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('LOWER(customer.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
  }

  async updateCustomer(
    id: Uuid,
    customerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = await this.findCustomerById(id);
    const updatedCustomer = { ...customer, ...customerDto };

    return this.customerRepository.save(updatedCustomer);
  }

  async deleteCustomer(id: Uuid): Promise<void> {
    const result = await this.customerRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  // Helper service for Order Frontend
  async getBasicCustomerInfo(): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      select: ['id', 'name', 'phoneNumber'],
    });
  }

  async getCustomer(customerId: Uuid): Promise<CustomerDto> {
    const userEntity = await this.findCustomerById(customerId);

    return userEntity.toDto();
  }

  async getAllCustomer(
    pageOptionsDto: CustomersPageOptionsDto,
  ): Promise<PageDto<CustomerDto>> {
    const queryBuilder =
      this.customerRepository.createQueryBuilder('customers');

    // Handle optional filters
    if (pageOptionsDto.customerName) {
      queryBuilder.where('customers.name ILIKE :name', {
        name: `%${pageOptionsDto.customerName}%`,
      });
    }

    if (pageOptionsDto.phoneNumber) {
      queryBuilder.andWhere('customers.phoneNumber = :phoneNumber', {
        phoneNumber: pageOptionsDto.phoneNumber,
      });
    }

    if (pageOptionsDto.address) {
      queryBuilder.andWhere('customers.address ILIKE :address', {
        address: `%${pageOptionsDto.address}%`,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  // Analytics

  async getTotalCustomers(): Promise<number> {
    return this.customerRepository.count();
  }
}
