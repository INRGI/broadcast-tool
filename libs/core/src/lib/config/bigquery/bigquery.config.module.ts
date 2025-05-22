import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { BigQueryConfigService } from './bigquery.config.service';

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
  providers: [ConfigService, BigQueryConfigService],
  exports: [ConfigService, BigQueryConfigService],
})
export class BigQueryConfigModule {}
