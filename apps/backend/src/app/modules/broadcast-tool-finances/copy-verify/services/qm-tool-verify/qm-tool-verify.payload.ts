import { GetDomainDataResponse, GetProductDataResponse } from "@epc-services/interface-adapters";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface QmToolVerifyPayload {
  copyName: string;
  domain: string;
  sendingDate: string;
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
  adminBroadcastConfig: AdminBroadcastConfigProps;
}
