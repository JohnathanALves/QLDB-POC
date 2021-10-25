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

  @Get('/user/:userId/vault')
  async getUserVault(
    @Param() { userId }: { userId: string },
    @Query() { vault }: { vault: string },
  ): Promise<any> {
    console.log({ userId, vault });
    return this.appService.getUserVault(userId, vault);
  }
}
