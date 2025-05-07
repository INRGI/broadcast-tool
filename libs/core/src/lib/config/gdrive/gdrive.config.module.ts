import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { GdriveConfigService } from './gdrive.config.service';

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
  providers: [ConfigService, GdriveConfigService],
  exports: [ConfigService, GdriveConfigService],
})
export class GdriveConfigModule {}
