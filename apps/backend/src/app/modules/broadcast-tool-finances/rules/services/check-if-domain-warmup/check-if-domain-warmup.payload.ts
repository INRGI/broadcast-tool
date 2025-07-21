import { GetDomainDataResponse } from "@epc-services/interface-adapters";

export interface CheckIfDomainWarmupPayload {
  domain: string;
  domainsData: GetDomainDataResponse[];
}
