import { Module } from "@nestjs/common";
import { BigQueryModule } from "./bigQuery/bigQuery.module";
import { PriorityModule } from "./priority/priority.module";
import { MondayModule } from "./monday/monday.module";
import { RulesModule } from "./rules/rules.module";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { AuthModule } from "./auth/auth.module";
import { QmToolModule } from "./qm-tool/qm-tool.module";

@Module({
  imports: [
    BigQueryModule,
    PriorityModule,
    MondayModule,
    RulesModule,
    BroadcastModule,
    AuthModule,
    QmToolModule,
  ]
})
export class BroadcastToolFinancesModule {}
