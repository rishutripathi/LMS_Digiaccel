import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StorageService } from '../services/storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('set')
  setItem(@Body() body: { key: string; value: any }): string {
    this.storageService.setItem(body.key, body.value);
    return `Item with key ${body.key} set.`;
  }

  @Get('get/:key')
  getItem(@Param('key') key: string): any {
    return this.storageService.getItem(key);
  }

  @Delete('clear/:key')
  clearItem(@Param('key') key: string): string {
    this.storageService.clearItem(key);
    return `Item with key ${key} cleared.`;
  }

  @Delete('clearAll')
  clearAll(): string {
    this.storageService.clearAll();
    return 'All items cleared.';
  }
}
