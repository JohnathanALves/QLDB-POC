import { RetryConfig, QldbDriver } from 'amazon-qldb-driver-nodejs';
import { ClientConfiguration } from 'aws-sdk/clients/acm';
import { Agent } from 'https';

export const QLDBFactory = {
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
