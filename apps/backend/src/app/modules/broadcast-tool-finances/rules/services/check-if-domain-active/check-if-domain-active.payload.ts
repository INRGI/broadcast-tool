import {
  DomainRules,
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
} from '@epc-services/interface-adapters';

export interface CheckIfDomainActivePayload {
  domainRules: DomainRules;
  broadcast: GetAllDomainsResponseDto;
  sendingDate: string;
  domain: string;
  domainsData: GetDomainDataResponse[];
}
