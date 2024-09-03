import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  private store: Record<string, any> = {};

  setItem(key: string, value: any): void {
    this.store[key] = value;
  }

  getItem(key: string): any {
    return this.store[key] ?? null;
  }

  clearItem(key: string): void {
    delete this.store[key];
  }

  clearAll(): void {
    this.store = {};
  }
}
