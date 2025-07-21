import { DomainSending } from "./domain-sending.interface";

export interface DomainRules {
  allowedMondayStatuses: string[];
  domainSending: DomainSending[];
}
