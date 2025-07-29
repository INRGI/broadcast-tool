import { DomainStatusResponseDto } from "./domain-status.response.dto";

export interface BroadcastDomainsSheetResponseDto {
  sheetName: string;
  domains: DomainStatusResponseDto[];
}
