import { CopyTabLimit } from "./copy-tab-limit.interface";

export interface UsageRules {
  productMinDelayPerDays: number;
  copyMinDelayPerDays: number;
  useNewestTestCopies: boolean;
  copyTabLimit: CopyTabLimit[];
}