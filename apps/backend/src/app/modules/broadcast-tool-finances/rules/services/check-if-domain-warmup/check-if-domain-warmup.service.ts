import { Injectable } from "@nestjs/common";
import { CheckIfDomainWarmupPayload } from "./check-if-domain-warmup.payload";
import { normalizeDomain } from "../../utils/normalizeDomain";

@Injectable()
export class CheckIfDomainWarmupService {
  public async execute(payload: CheckIfDomainWarmupPayload): Promise<boolean> {
    const { domain, domainsData } = payload;
    const normalized = normalizeDomain(domain);

    const domainData = domainsData.find(({ domainName }) => {
      const normalizedName = normalizeDomain(domainName);
      return (
        normalizedName === normalized ||
        normalizedName.endsWith(`_${normalized}`) ||
        normalizedName.endsWith(`-${normalized}`)
      );
    });

    return domainData?.domainStatus === "Warm Up";
  }
}
