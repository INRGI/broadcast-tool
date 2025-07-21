import {
  BroadcastDomain,
  GetProductDataResponse,
  ProductRules,
} from "@epc-services/interface-adapters";

export interface CheckIfSectorCanBeSendPayload {
  copyName: string;
  broadcastDomain: BroadcastDomain;
  sendingDate: string;
  productRules: ProductRules;
  productsData: GetProductDataResponse[];
}
