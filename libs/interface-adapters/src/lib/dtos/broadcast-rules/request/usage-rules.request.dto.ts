import { IsArray, IsNumber } from "class-validator";
import { CopyTabLimitRequestDto } from "./copy-tab-limit.requst.dto";

export class UsageRulesRequestDto {
  @IsNumber()
  public productMinDelayPerDays: number;

  @IsNumber()
  public copyMinDelayPerDays: number;

  @IsArray()
  public copyTabLimit: CopyTabLimitRequestDto[];
}
