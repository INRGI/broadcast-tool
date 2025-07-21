import {
  AnalyticSelectionRules,
  DomainRules,
  PartnerRules,
  TestingRules,
} from "../../../types/broadcast-tool";

export interface CreateAdminBroadcastConfigRequestDto {
  niche: string;
  testingRules: TestingRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
