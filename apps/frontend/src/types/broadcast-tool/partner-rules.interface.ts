import { PartnerAllowedSendingDays } from "./partner-allowed-sending-days.interface";

export interface PartnerRules {
  blacklistedPartners: string[];
  similarPartnerDomainLimit: number;
  partnerAllowedSendingDays: PartnerAllowedSendingDays[];
}
