import { Global, Module } from '@nestjs/common';
import { FsStorageService } from './fs-storage.service';

@Global()
@Module({
  providers: [FsStorageService],
  exports: [FsStorageService],
})
export class StorageModule {}
