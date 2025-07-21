import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  BroadcastRules,
  BroadcastRulesSchema,
} from "../../schemas/broadcast-rules.schema";
import { BroadcastRulesRepository } from "./broadcast-rules.repository";
import {
  AdminBroadcastConfig,
  AdminBroadcastConfigSchema,
} from "../../schemas/admin-broadcast-config.schema";
import { AdminBroadcastConfigRepository } from "./admin-broadcast-config.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BroadcastRules.name, schema: BroadcastRulesSchema },
      { name: AdminBroadcastConfig.name, schema: AdminBroadcastConfigSchema },
    ]),
  ],
  providers: [BroadcastRulesRepository, AdminBroadcastConfigRepository],
  exports: [BroadcastRulesRepository, AdminBroadcastConfigRepository],
})
export class BroadcastRulesRepositoryModule {}
