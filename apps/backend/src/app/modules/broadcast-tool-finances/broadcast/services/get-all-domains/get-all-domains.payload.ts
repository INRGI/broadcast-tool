import { UsageRules } from "@epc-services/interface-adapters";

export interface GetAllDomainsPayload {
  broadcastId: string;
  usageRules: UsageRules;
}
