import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./copy-verify.providers";
import { RulesModule } from "../rules/rules.module";
import { PriorityModule } from "../priority/priority.module";

@Module({
  imports: [RulesModule, PriorityModule],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyVerifyModule {}
