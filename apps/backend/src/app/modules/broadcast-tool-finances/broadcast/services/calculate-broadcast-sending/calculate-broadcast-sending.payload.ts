import {
  GetAllDomainsResponseDto,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";

export interface CalculateBroadcastSendingPayload {
  dateRange: string[];
  broadcastName: string;
  broadcast: GetAllDomainsResponseDto;
  productsData: GetProductDataResponse[];
}
