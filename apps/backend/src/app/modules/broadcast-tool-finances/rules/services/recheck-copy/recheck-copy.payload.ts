import {
  BroadcastDomain,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../domain/types/broadcast-rules.types";
import { AdminBroadcastConfigProps } from "../../domain/types/admin-broadcast-config.types";

export interface RecheckCopyPayload {
  copyName: string;
  broadcastDomain: BroadcastDomain;
  sendingDate: string;
  broadcastRules: BroadcastRulesProps;
  productsData: GetProductDataResponse[];
  adminBroadcastConfig: AdminBroadcastConfigProps;
}
