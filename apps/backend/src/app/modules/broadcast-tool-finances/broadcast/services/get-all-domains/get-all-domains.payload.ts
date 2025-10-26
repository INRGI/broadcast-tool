import { IgnoringRules, UsageRules } from "@epc-services/interface-adapters";

export interface GetAllDomainsPayload {
  broadcastId: string;
  usageRules: UsageRules;
  ignoringRules: IgnoringRules;
  filterFromISO?: string; 
}
