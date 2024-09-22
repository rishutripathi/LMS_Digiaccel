import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        mongoose.set('debug', process.env.ENVIROMENT === 'development'); // for logging mongo queries
        return {
          uri:
            configService.get<string>('MONGO_URI') +
            '/' +
            configService.get<string>('MONGO_DB'), // process.env.MONGO_URI
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}