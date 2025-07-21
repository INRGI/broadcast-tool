import {
  BroadcastDomain,
  GetProductDataResponse,
  PartnerRules,
} from "@epc-services/interface-adapters";

export interface CheckIfPartnerCanBeSendPayload {
  copyName: string;
  broadcastDomain: BroadcastDomain;
  sendingDate: string;
  partnerRules: PartnerRules;
  productsData: GetProductDataResponse[];
}
