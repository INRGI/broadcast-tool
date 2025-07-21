import {
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface GetPossibleReplacementCopiesPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastRules: BroadcastRulesProps;
  adminBroadcastConfig: AdminBroadcastConfigProps;
  dateRange: string[];
  clickableCopies: string[];
  convertibleCopies: string[];
  warmupCopies: string[];
  testCopies: string[];
  priorityCopiesData: string[];
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
