import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./broadcast.providers";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { GdriveConfigModule, BigQueryConfigModule } from "@epc-services/core";
import { GdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/gdrive-api.options-factory.service";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { PriorityModule } from "../priority/priority.module";
import { BigQueryApiModule } from "@epc-services/bigquery-api";
import { BigQueryApiOptionsFactoryService } from "../../../infrastructure/options-factory/bigquery-api.options-factory.service";

@Module({
  imports: [
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
    BigQueryApiModule.registerAsync({
      imports: [BigQueryConfigModule],
      useClass: BigQueryApiOptionsFactoryService,
    }),
    PriorityModule,
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}
