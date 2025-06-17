import { Module } from "@nestjs/common";
import { PriorityModule } from "./priority/priority.module";
import { BroadcastModule } from "./broadcast/broadcast.module";

@Module({
  imports: [PriorityModule, BroadcastModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FinancesModule {}
