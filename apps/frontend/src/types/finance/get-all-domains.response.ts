import { BroadcastDomain } from "./domain.types";

export interface GetAllDomainsResponse {
  sheets: { sheetName: string; domains: BroadcastDomain[] }[];
}
