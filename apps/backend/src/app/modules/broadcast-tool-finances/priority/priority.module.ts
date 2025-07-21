import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./priority.providers";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { GdriveConfigModule } from "@epc-services/core";
import { GdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/gdrive-api.options-factory.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
    CacheModule.register({
      ttl: 900000,
      isGlobal: true,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class PriorityModule {}
