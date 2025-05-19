import { Module } from "@nestjs/common";
import { MondayModule } from "./monday/monday.module";
import { PriorityModule } from "./priority/priority.module";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { BroadcastAutomationModule } from "./broadcast-automation/broadcast-automation.module";

@Module({
  imports: [MondayModule, PriorityModule, BroadcastModule, BroadcastAutomationModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FinancesModule {}
