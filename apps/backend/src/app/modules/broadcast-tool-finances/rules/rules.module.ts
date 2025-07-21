import { Module } from "@nestjs/common";
import {
  messageControllers,
  queryProviders,
  serviceProviders,
} from "./rules.providers";
import { BroadcastRulesRepositoryModule } from "../../../infrastructure/database/repositories/broadcast-rules/broadcast-rules.repository.module";
import { MondayModule } from "../monday/monday.module";
import { BigQueryModule } from "../bigQuery/bigQuery.module";

@Module({
  imports: [BroadcastRulesRepositoryModule, MondayModule, BigQueryModule],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...queryProviders],
  exports: [...serviceProviders, ...queryProviders],
})
export class RulesModule {}
