import { Module } from "@nestjs/common";
import { MondayModule } from "./monday/monday.module";
import { PriorityModule } from "./priority/priority.module";
import { BroadcastModule } from "./broadcast/broadcast.module";

@Module({
  imports: [MondayModule, PriorityModule, BroadcastModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FinancesModule {}
