import { IsArray } from "class-validator";
import { StrategyRequestDto } from "./strategy.request.dto";
import { DomainTabPrioritiesRequestDto } from "./domain-tab-priorities.request.dto";

export class CopyAssignmentStrategyRulesRequestDto {
  @IsArray()
  public domainStrategies: StrategyRequestDto[];

  @IsArray()
  public domainPriorities: DomainTabPrioritiesRequestDto[];
}
