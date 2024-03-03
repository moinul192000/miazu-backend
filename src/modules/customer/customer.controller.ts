import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { type CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerDto } from './dtos/customer.dto';
import { type CustomerBasicDto } from './dtos/customer-basic.dto';
import { CustomersPageOptionsDto } from './dtos/customers-page-options.dto';

@ApiTags('customer')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Get all customers',
  })
  @Auth([RoleType.ADMIN])
  async getCustomers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: CustomersPageOptionsDto,
  ): Promise<PageDto<CustomerDto>> {
    return this.customerService.getAllCustomer(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.ADMIN, RoleType.MODERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a customer by ID',
    type: CustomerDto,
  })
  getUser(@UUIDParam('id') customerId: Uuid): Promise<CustomerDto> {
    return this.customerService.getCustomer(customerId);
  }

  @Get('basic-info')
  @ApiResponse({
    status: 200,
    description: 'Get all customers basic info',
  })
  @Auth([RoleType.ADMIN])
  async getCustomersBasicInfo(): Promise<CustomerBasicDto[]> {
    return this.customerService.getBasicCustomerInfo();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a customer',
  })
  @Auth([RoleType.ADMIN])
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customerService.createCustomer(createCustomerDto);
  }
}
