import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTransactionById(@Query() { txId }: { txId: string }): Promise<any> {
    console.log({ txId });
    return this.appService.getTransactionById(txId);
  }
}
