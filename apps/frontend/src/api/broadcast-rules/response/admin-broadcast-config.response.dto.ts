import {
  AnalyticSelectionRules,
  DomainRules,
  PartnerRules,
  TestingRules,
} from "../../../types/broadcast-tool";

export interface AdminBroadcastConfigResponseDto {
  _id: string;
  niche: string;
  testingRules: TestingRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
