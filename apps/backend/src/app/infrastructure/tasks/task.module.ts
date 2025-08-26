import { Module } from "@nestjs/common";
import { taskSchedulerProviders } from "./task.providers";
import { MondayModule } from "../../modules/broadcast-tool-finances/monday/monday.module";

@Module({
  imports: [MondayModule],
  providers: [...taskSchedulerProviders],
})
export class TaskModule {}
