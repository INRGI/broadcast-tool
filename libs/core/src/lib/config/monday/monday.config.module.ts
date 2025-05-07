import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { MondayConfigService } from './monday.config.service';

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
  providers: [ConfigService, MondayConfigService],
  exports: [ConfigService, MondayConfigService],
})
export class MondayConfigModule {}
