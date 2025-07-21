import {
  GetAllDomainsResponseDto,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";

export interface AddCustomLinkIndicatorPayload {
  broadcast: GetAllDomainsResponseDto;
  dateRange: string[];
  productsData: GetProductDataResponse[];
}
