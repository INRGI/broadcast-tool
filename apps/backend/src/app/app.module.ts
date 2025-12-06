import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BroadcastToolFinancesModule } from './modules/broadcast-tool-finances/broadcast-tool-finances.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './infrastructure/tasks/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { BigQueryModule } from './modules/bigQuery/bigQuery.module';

@Module({
  imports: [    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    AuthModule,
    BigQueryModule,
    BroadcastToolFinancesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL')
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
