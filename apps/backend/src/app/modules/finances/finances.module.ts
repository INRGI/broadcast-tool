import { Module } from "@nestjs/common";
import { MondayModule } from "./monday/monday.module";

@Module({
  imports: [MondayModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FinancesModule {}
