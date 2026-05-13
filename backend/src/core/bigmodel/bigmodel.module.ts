import { Module } from '@nestjs/common';
import { BigModelService } from './bigmodel.service';

@Module({
  providers: [BigModelService],
  exports: [BigModelService],
})
export class BigModelModule {}
