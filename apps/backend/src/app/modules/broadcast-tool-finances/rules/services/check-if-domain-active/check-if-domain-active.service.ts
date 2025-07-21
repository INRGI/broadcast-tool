import { Injectable } from "@nestjs/common";
import { CheckIfDomainActivePayload } from "./check-if-domain-active.payload";
import { normalizeDomain } from "../../utils/normalizeDomain";

@Injectable()
export class CheckIfDomainActiveService {
  public async execute(payload: CheckIfDomainActivePayload): Promise<boolean> {
    const { domainRules, domainsData, domain } = payload;

    const normalized = normalizeDomain(domain);

    const domainData = domainsData.find(({ domainName }) => {
      const normalizedName = normalizeDomain(domainName);
      return (
        normalizedName === normalized ||
        normalizedName.endsWith(`_${normalized}`) ||
        normalizedName.endsWith(`-${normalized}`)
      );
    });

    return domainData
      ? domainRules.allowedMondayStatuses.includes(domainData.domainStatus)
      : false;
  }
}
