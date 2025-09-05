import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./qm-tool.providers";
import { CopyVerifyModule } from "../copy-verify/copy-verify.module";
import { MondayModule } from "../monday/monday.module";
import { RulesModule } from "../rules/rules.module";
import { BroadcastModule } from "../broadcast/broadcast.module";

@Module({
  imports: [CopyVerifyModule, RulesModule, MondayModule, BroadcastModule],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class QmToolModule {}
