import {
  AnalyticSelectionRules,
  DomainRules,
  PartnerRules,
  TestingRules,
} from "@epc-services/interface-adapters";

export interface UpdateAdminBroadcastConfigPayload {
  readonly _id: string;
  readonly niche: string;
  readonly domainRules: DomainRules;
  readonly testingRules: TestingRules;
  readonly partnerRules: PartnerRules;
  readonly analyticSelectionRules: AnalyticSelectionRules;
}
