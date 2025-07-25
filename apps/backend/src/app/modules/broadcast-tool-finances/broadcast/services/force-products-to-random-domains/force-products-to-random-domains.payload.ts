import {
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
  ProductMinLimitPerDay,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface ForceProductsToRandomDomainsPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastRules: BroadcastRulesProps;
  adminBroadcastConfig: AdminBroadcastConfigProps;
  fromDate: string;
  toDate: string;
  copiesToForce: ProductMinLimitPerDay[];
  priorityCopiesData: string[];
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
  convertibleCopies: string[];
}
