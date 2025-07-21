import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";

export interface CheckWarmupCopyLimitsPayload {
  copyName: string;
  broadcast: GetAllDomainsResponseDto;
  sendingDate: string;
}
