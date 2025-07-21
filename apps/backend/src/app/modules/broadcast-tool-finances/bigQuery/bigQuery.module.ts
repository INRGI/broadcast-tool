import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./bigQuery.providers";
import { BigQueryApiModule } from "@epc-services/bigquery-api";
import { BigQueryConfigModule } from "@epc-services/core";
import { BigQueryApiOptionsFactoryService } from "../../../infrastructure/options-factory/bigquery-api.options-factory.service";
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    BigQueryApiModule.registerAsync({
      imports: [BigQueryConfigModule],
      useClass: BigQueryApiOptionsFactoryService,
    }),
    CacheModule.register({
      ttl: 3600000,
      isGlobal: true,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BigQueryModule {}
