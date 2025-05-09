import { BroadcastDomain } from "../../../interfaces";

export class GetAllDomainsResponse {
  sheets: { sheetName: string; domains: BroadcastDomain[] }[];
}
