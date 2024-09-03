import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageController } from './controllers/storage.controller';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
