import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./broadcast.providers";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { GdriveConfigModule } from "@epc-services/core";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { PriorityModule } from "../priority/priority.module";
import { GdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/gdrive-api.options-factory.service";
import { RulesModule } from "../rules/rules.module";
import { BigQueryModule } from "../bigQuery/bigQuery.module";
import { CopyVerifyModule } from "../copy-verify/copy-verify.module";
import { MondayModule } from "../monday/monday.module";
import { CacheModule } from "@nestjs/cache-manager";

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
    CacheModule.register({
      ttl: 600000,
      isGlobal: true,
    }),
    PriorityModule,
    RulesModule,
    BigQueryModule,
    CopyVerifyModule,
    MondayModule,
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}
