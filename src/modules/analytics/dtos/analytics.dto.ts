import { NumberField } from '../../../decorators';

export class AnalyticsDto {
  @NumberField()
  totalStocks: number;

  @NumberField()
  totalCustomers: number;

  @NumberField()
  totalOrders: number;

  @NumberField()
  totalPaymentsValue: number;

  @NumberField()
  totalEstimatedStockValue: number;

  constructor(data: AnalyticsDto) {
    this.totalStocks = data.totalStocks;
    this.totalCustomers = data.totalCustomers;
    this.totalOrders = data.totalOrders;
    this.totalPaymentsValue = data.totalPaymentsValue;
    this.totalEstimatedStockValue = data.totalEstimatedStockValue;
  }
}
