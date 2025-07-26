import {
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
  PartnerMinLimitPerDay,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface ForcePartnersToRandomDomainsPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastRules: BroadcastRulesProps;
  adminBroadcastConfig: AdminBroadcastConfigProps;
  fromDate: string;
  toDate: string;
  copiesToForce: PartnerMinLimitPerDay[];
  priorityCopiesData: string[];
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
  convertibleCopies: string[];
}
