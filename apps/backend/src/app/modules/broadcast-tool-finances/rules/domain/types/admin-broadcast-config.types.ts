import {
  AnalyticSelectionRules,
  DomainRules,
  IgnoringRules,
  PartnerRules,
  TestingRules,
} from "@epc-services/interface-adapters";

export interface CreateAdminBroadcastConfigProps {
  niche: string;
  partnerRules: PartnerRules;
  domainRules: DomainRules;
  testingRules: TestingRules;
  analyticSelectionRules: AnalyticSelectionRules;
  ignoringRules: IgnoringRules;
}

export type AdminBroadcastConfigProps = CreateAdminBroadcastConfigProps;

export interface UpdateAdminBroadcastConfigProps {
  readonly niche: string;
  readonly testingRules: TestingRules;
  readonly partnerRules: PartnerRules;
  readonly domainRules: DomainRules;
  readonly analyticSelectionRules: AnalyticSelectionRules;
  readonly ignoringRules: IgnoringRules;
}
