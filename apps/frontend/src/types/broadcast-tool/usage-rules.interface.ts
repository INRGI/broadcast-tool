import { CopyTabLimit } from "./copy-tab-limit.interface";
import { PartnerTabLimit } from "./partner-tab-limit.interface";

export interface UsageRules {
  productMinDelayPerDays: number;
  copyMinDelayPerDays: number;
  useNewestTestCopies: boolean;
  copyTabLimit: CopyTabLimit[];
  partnerMaxTabLimit?: PartnerTabLimit[];
  partnerMinTabLimit?: PartnerTabLimit[];
}