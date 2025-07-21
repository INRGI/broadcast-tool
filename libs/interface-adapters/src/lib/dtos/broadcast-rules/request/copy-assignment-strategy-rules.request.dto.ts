import { IsArray } from "class-validator";
import { StrategyRequestDto } from "./strategy.request.dto";

export class CopyAssignmentStrategyRulesRequestDto {
  @IsArray()
  public domainStrategies: StrategyRequestDto[];
}
