import { Module } from "@nestjs/common";
import { PriorityModule } from "./priority/priority.module";
import { MondayModule } from "./monday/monday.module";
import { RulesModule } from "./rules/rules.module";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { QmToolModule } from "./qm-tool/qm-tool.module";

@Module({
  imports: [
    PriorityModule,
    MondayModule,
    RulesModule,
    BroadcastModule,
    QmToolModule,
  ]
})
export class BroadcastToolFinancesModule {}
