import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { StatisticConfigService } from './statistic.config.service';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [configuration],
    }),
  ],
  providers: [ConfigService, StatisticConfigService],
  exports: [ConfigService, StatisticConfigService],
})
export class StatisticConfigModule {}
