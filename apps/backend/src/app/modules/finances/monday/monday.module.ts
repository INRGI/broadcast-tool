import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./monday.providers";
import { MondayApiModule } from "@epc-services/monday-api";
import { MondayConfigModule } from "@epc-services/core";
import { MondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/monday-api.options-factory.service";

@Module({
  imports: [
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class MondayModule {}
