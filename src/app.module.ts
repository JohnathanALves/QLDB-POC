import { Module } from '@nestjs/common';
import { QldbDriver, RetryConfig } from 'amazon-qldb-driver-nodejs';
import { ClientConfiguration } from 'aws-sdk/clients/acm';
import { Agent } from 'https';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const QLDBFactory = {
  provide: 'QLDBCONNECTION',
  useFactory: () => {
    const maxConcurrentTransactions = 10;
    const agentForQldb: Agent = new Agent({
      keepAlive: true,
      maxSockets: maxConcurrentTransactions,
    });
    const serviceConfigurationOptions: ClientConfiguration = {
      region: 'us-east-1',
      httpOptions: {
        agent: agentForQldb,
      },
    };
    const retryLimit = 4;
    // Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
    const retryConfig: RetryConfig = new RetryConfig(retryLimit);

    const driver: QldbDriver = new QldbDriver(
      'firstLedger',
      serviceConfigurationOptions,
      maxConcurrentTransactions,
      retryConfig,
    );
    return driver;
  },
};
@Module({
  imports: [],
  controllers: [AppController],
  providers: [QLDBFactory, AppService],
})
export class AppModule {}
