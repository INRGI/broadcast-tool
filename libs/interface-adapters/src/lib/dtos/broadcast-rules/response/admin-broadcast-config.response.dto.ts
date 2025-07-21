import { IsString, Length } from "class-validator";
import { AnalyticSelectionRulesRequestDto } from "../request/analytic-selection-rules.request.dto";
import { TestingRulesRequestDto } from "../request/testing-rules.request.dto";
import { PartnerRulesRequestDto } from "../request/partner-rules.request.dto";
import { DomainRulesRequestDto } from "../request/domain-rules.request.dto";

export class AdminBroadcastConfigResponseDto {
  @IsString()
  @Length(1, 50)
  public niche: string;

  public testingRules: TestingRulesRequestDto;

  public partnerRules: PartnerRulesRequestDto;

  public domainRules: DomainRulesRequestDto;

  public analyticSelectionRules: AnalyticSelectionRulesRequestDto;
}
