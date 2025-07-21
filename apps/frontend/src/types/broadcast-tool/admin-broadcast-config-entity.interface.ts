import { AnalyticSelectionRules } from "./analytic-selection-rules.interface";
import { DomainRules } from "./domain-rules.interface";
import { PartnerRules } from "./partner-rules.interface";
import { TestingRules } from "./testing-rules.interface";

export interface AdminBroadcastConfigEntity {
  _id: string;
  niche: string;
  testingRules: TestingRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
