import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QLDBFactory } from './configs/qldb.factory';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [QLDBFactory, AppService],
})
export class AppModule {}
