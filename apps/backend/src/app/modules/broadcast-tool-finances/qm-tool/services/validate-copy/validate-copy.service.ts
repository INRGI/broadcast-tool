import { Inject, Injectable } from "@nestjs/common";
import { ValidateCopyPayload } from "./validate-copy.payload";
import { QmToolVerifyService } from "../../../copy-verify/services/qm-tool-verify/qm-tool-verify.service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { normalizeDomain } from "../../../rules/utils/normalizeDomain";
import { GetDomainBroadcastByTeamService } from "../../../broadcast/services/get-domain-broadcast-by-team/get-domain-broadcast-by-team.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { BroadcastDomainRequestDto } from "@epc-services/interface-adapters";
import { GetBlacklistedCopiesService } from "../../../bigQuery/services/get-blacklisted-copies/get-blacklisted-copies.service";

@Injectable()
export class ValidateCopyService {
  constructor(
    private readonly qmToolVerifyService: QmToolVerifyService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    private readonly getDomainBroadcastByTeamService: GetDomainBroadcastByTeamService,
    private readonly getBlacklistedCopiesService: GetBlacklistedCopiesService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(
    payload: ValidateCopyPayload
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const { copyName, domain, sendingDate, isSpaceAd } = payload;

    const adminConfig =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: "finance",
      });

    const domainsData = await this.getAllMondayDomainsDataService.execute();

    const domainData = domainsData.find(
      (domainName) =>
        normalizeDomain(domain) === normalizeDomain(domainName.domainName) ||
        normalizeDomain(domainName.domainName)
          .trim()
          .endsWith(`_${normalizeDomain(domain)}`) ||
        normalizeDomain(domainName.domainName)
          .trim()
          .endsWith(`-${normalizeDomain(domain)}`)
    );

    if (!domainData || !domainData.domainStatus) {
      return {
        isValid: false,
        errors: [`Domain ${domain} is not found in Monday`],
      };
    }

    if (!domainData.team) {
      return {
        isValid: false,
        errors: [`Domain ${domain} has no assigned team in Monday`],
      };
    }

    const team = domainData.team;
    const normDomain = normalizeDomain(domain);
    const cacheKey = `broadcast:${team}:${normDomain}`;

    let broadcast = await this.cacheManager.get<BroadcastDomainRequestDto>(cacheKey);
    if (!broadcast) {
      broadcast = await this.getDomainBroadcastByTeamService.execute({ team, domain });
      await this.cacheManager.set(cacheKey, broadcast, 600000);
    }

    if(!broadcast || !broadcast?.domain) {
      return {
        isValid: false,
        errors: [`Failed to get broadcast data due to rate limit`],
      };
    }
    const productsData = await this.getAllMondayProductsDataService.execute();

    const blacklistedCopies = await this.getBlacklistedCopiesService.execute();
   
    const result = await this.qmToolVerifyService.execute({
      copyName,
      domain,
      domainsData,
      productsData,
      adminBroadcastConfig: adminConfig,
      sendingDate,
      isSpaceAd,
      broadcast,
      blacklistedCopies
    });
    return result;
  }
}
