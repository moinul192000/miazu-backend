import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { OrderService } from './order.service';

@ApiTags('return')
@Controller('return')
export class ReturnController {
  constructor(private readonly orderService: OrderService) {}

  @Patch('/:returnId')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  async returnOrder(
    @Param('returnId') returnId: Uuid,
    @Body() body: { isReturned: boolean },
  ) {
    const { isReturned } = body;

    if (isReturned) {
      return this.orderService.markReturnAsReturned(returnId);
    }

    throw new BadRequestException('Return must be marked as returned');
  }
}
