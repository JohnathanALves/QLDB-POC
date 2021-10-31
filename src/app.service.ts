import { Inject, Injectable } from '@nestjs/common';
import { QldbDriver, SessionPoolEmptyError } from 'amazon-qldb-driver-nodejs';

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

  async initializeUser(userId: string) {
    return this.qldbDriver.executeLambda(async (txn) => {
      await txn.execute('INSERT INTO Users VALUE ?', {
        userId,
        BTC: 0,
        USD: 0,
        EUR: 0,
        GBP: 0,
      });
    });
  }

  async makeSendTransaction(
    userId: string,
    vault: string,
    amount: number,
    addressTo: string,
  ) {
    return this.qldbDriver.executeLambda(async (txn) => {
      const [user] = (
        await txn.execute('SELECT * FROM Users WHERE userId = ?', userId)
      ).getResultList();

      if (!user) {
        await this.initializeUser(userId);
      }

      const currentVault = user[vault]?.numberValue() ?? 0;

      // check whether User has funds
      if (currentVault < amount) throw new Error('Not enough funds to SEND.');

      const newVault = currentVault - amount;

      // store new Transaction
      await txn.execute('INSERT INTO Transactions VALUE ?', {
        userId,
        amount,
        addressTo,
        type: 'SEND',
      });

      // Update User vault
      await txn.execute(
        'UPDATE ? SET ? FROM Users WHERE userId = ?',
        vault,
        newVault,
        userId,
      );
    });
  }

  async makeDepositTransaction(
    userId: string,
    vault: string,
    amount: number,
    transactionId: string,
  ) {
    return this.qldbDriver.executeLambda(async (txn) => {
      const [user] = (
        await txn.execute('SELECT * FROM Users WHERE userId = ?', userId)
      ).getResultList();

      if (!user) {
        await this.initializeUser(userId);
      }

      const currentVault = user ? user[vault]?.numberValue() ?? 0 : 0;

      const newVault = currentVault + amount;

      // store new Transaction
      const [transaction] = (
        await txn.execute('INSERT INTO Transactions VALUE ?', {
          userId,
          amount: amount.toFixed(8),
          transactionId,
          type: 'DEPOSIT',
        })
      ).getResultList();

      // Update User vault
      await txn.execute(
        'UPDATE Users AS u SET u.BTC = ? WHERE u.userId = ?',
        newVault,
        userId,
      );

      setTimeout(() => {}, 10000);

      return transaction;
    });
  }
}
