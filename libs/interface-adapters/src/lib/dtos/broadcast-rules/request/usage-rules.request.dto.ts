import { IsArray, IsBoolean, IsNumber, IsOptional } from "class-validator";
import { CopyTabLimitRequestDto } from "./copy-tab-limit.requst.dto";
import { PartnerTabLimitRequestDto } from "./partner-tab-limit.requst.dto";

export class UsageRulesRequestDto {
  @IsNumber()
  public productMinDelayPerDays: number;

  @IsBoolean()
  public useNewestTestCopies: boolean;

  @IsNumber()
  public copyMinDelayPerDays: number;

  @IsArray()
  public copyTabLimit: CopyTabLimitRequestDto[];

  @IsArray()
  @IsOptional()
  public partnerMaxTabLimit?: PartnerTabLimitRequestDto[];

  @IsArray()
  @IsOptional()
  public partnerMinTabLimit?: PartnerTabLimitRequestDto[];
}
