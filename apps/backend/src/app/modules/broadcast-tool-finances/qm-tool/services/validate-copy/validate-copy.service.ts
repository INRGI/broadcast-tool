import { Injectable } from "@nestjs/common";
import { ValidateCopyPayload } from "./validate-copy.payload";
import { QmToolVerifyService } from "../../../copy-verify/services/qm-tool-verify/qm-tool-verify.service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { normalizeDomain } from "../../../rules/utils/normalizeDomain";
import { GetDomainBroadcastByTeamService } from "../../../broadcast/services/get-domain-broadcast-by-team/get-domain-broadcast-by-team.service";

@Injectable()
export class ValidateCopyService {
  constructor(
    private readonly qmToolVerifyService: QmToolVerifyService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    private readonly getDomainBroadcastByTeamService: GetDomainBroadcastByTeamService
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

    const broadcast = await this.getDomainBroadcastByTeamService.execute({
      team: domainData.team,
      domain,
    });

    const productsData = await this.getAllMondayProductsDataService.execute();

    const result = await this.qmToolVerifyService.execute({
      copyName,
      domain,
      domainsData,
      productsData,
      adminBroadcastConfig: adminConfig,
      sendingDate,
      isSpaceAd,
      broadcast,
    });
    return result;
  }
}
