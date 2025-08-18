import {
  GetAllDomainsResponseDto,
  IgnoringRules,
} from "@epc-services/interface-adapters";

export interface AddPriorityCopyIndicatorPayload {
  broadcast: GetAllDomainsResponseDto;
  dateRange: string[];
  ignoringRules: IgnoringRules;
}
