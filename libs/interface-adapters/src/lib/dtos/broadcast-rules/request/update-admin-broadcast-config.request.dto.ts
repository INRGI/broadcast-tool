import { IsString, Length } from "class-validator";
import { AnalyticSelectionRulesRequestDto } from "./analytic-selection-rules.request.dto";
import { TestingRulesRequestDto } from "./testing-rules.request.dto";
import { PartnerRulesRequestDto } from "./partner-rules.request.dto";
import { DomainRulesRequestDto } from "./domain-rules.request.dto";

export class UpdateAdminBroadcastConfigRequestDto {
  public _id: string;

  @IsString()
  @Length(1, 50)
  public niche: string;

  public testingRules: TestingRulesRequestDto;

  public domainRules: DomainRulesRequestDto;

  public partnerRules: PartnerRulesRequestDto;

  public analyticSelectionRules: AnalyticSelectionRulesRequestDto;
}
