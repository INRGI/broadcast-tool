import { BroadcastDomainRequestDto, GetDomainDataResponse, GetProductDataResponse } from "@epc-services/interface-adapters";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface QmToolVerifyPayload {
  copyName: string;
  domain: string;
  isSpaceAd: boolean;
  sendingDate: string;
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
  adminBroadcastConfig: AdminBroadcastConfigProps;
  broadcast: BroadcastDomainRequestDto
}
