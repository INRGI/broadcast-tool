import {
  GetAllDomainsResponseDto,
  GetProductDataResponse,
  IgnoringRules,
} from "@epc-services/interface-adapters";

export interface AddCustomLinkIndicatorPayload {
  broadcast: GetAllDomainsResponseDto;
  dateRange: string[];
  productsData: GetProductDataResponse[];
  ignoringRules: IgnoringRules;
}
