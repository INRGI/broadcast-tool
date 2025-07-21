import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";

export interface AddPriorityCopyIndicatorPayload {
  broadcast: GetAllDomainsResponseDto;
  dateRange: string[];
}
