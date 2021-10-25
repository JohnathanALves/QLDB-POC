import { Inject, Injectable } from '@nestjs/common';
import { QldbDriver } from 'amazon-qldb-driver-nodejs';

@Injectable()
export class AppService {
  constructor(@Inject('QLDBCONNECTION') private qldbDriver: QldbDriver) {}

  async getTransactionById(txId: string): Promise<any> {
    const result = await this.qldbDriver.executeLambda(async (txn) => {
      return (
        await txn.execute('SELECT * FROM Transactions WHERE txID = ?', txId)
      ).getResultList();
    });
    return result;
  }

  async getUserVault(userId: string, vault: string): Promise<any> {
    const result = await this.qldbDriver.executeLambda(async (txn) => {
      return txn.execute('SELECT ? FROM Users WHERE userId = ?', vault, userId);
    });

    const [vaultValue] = result.getResultList();

    return { [vault]: vaultValue ?? 0 };
  }
}
