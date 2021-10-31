import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/transaction')
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

  @Post('/transaction/send')
  async makeSendTransaction(@Body() body) {
    console.log({ body });
    return this.appService.makeSendTransaction(
      body.userId,
      body.vault,
      body.amount,
      body.addressTo,
    );
  }

  @Post('/transaction/deposit')
  async makeDepositTransaction(@Body() body) {
    console.log({ body });
    return this.appService.makeDepositTransaction(
      body.userId,
      body.vault,
      body.amount,
      body.transactionId,
    );
  }
}
