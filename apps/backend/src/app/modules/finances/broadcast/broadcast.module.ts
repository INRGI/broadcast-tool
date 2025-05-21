import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./broadcast.providers";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { GdriveConfigModule, StatisticConfigModule } from "@epc-services/core";
import { GdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/gdrive-api.options-factory.service";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { PriorityModule } from "../priority/priority.module";
import { StatisticApiModule } from "@epc-services/statistic-api";
import { StatisticApiOptionsFactoryService } from "../../../infrastructure/options-factory/statistic-api.options-factory.service";

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
    StatisticApiModule.registerAsync({
      imports: [StatisticConfigModule],
      useClass: StatisticApiOptionsFactoryService,
    }),
    PriorityModule,
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}
