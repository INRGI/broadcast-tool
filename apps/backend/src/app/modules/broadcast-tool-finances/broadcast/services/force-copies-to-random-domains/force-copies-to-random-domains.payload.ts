import {
  CopyMinLimitPerDay,
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface ForceCopiesToRandomDomainsPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastRules: BroadcastRulesProps;
  adminBroadcastConfig: AdminBroadcastConfigProps;
  fromDate: string;
  toDate: string;
  copiesToForce: CopyMinLimitPerDay[];
  priorityCopiesData: string[];
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
