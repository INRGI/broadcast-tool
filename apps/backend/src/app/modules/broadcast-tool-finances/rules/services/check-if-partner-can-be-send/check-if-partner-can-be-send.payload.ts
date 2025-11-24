import {
  BroadcastDomain,
  GetAllDomainsResponseDto,
  GetProductDataResponse,
  PartnerRules,
  ProductRules,
  UsageRules,
} from "@epc-services/interface-adapters";

export interface CheckIfPartnerCanBeSendPayload {
  copyName: string;
  sheetName: string;
  broadcast: GetAllDomainsResponseDto;
  broadcastDomain: BroadcastDomain;
  sendingDate: string;
  partnerRules: PartnerRules;
  productRules: ProductRules;
  usageRules: UsageRules;
  productsData: GetProductDataResponse[];
}
