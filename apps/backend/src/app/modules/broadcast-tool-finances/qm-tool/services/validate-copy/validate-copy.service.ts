import { Injectable } from "@nestjs/common";
import { ValidateCopyPayload } from "./validate-copy.payload";
import { QmToolVerifyService } from "../../../copy-verify/services/qm-tool-verify/qm-tool-verify.service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";

@Injectable()
export class ValidateCopyService {
  constructor(
    private readonly qmToolVerifyService: QmToolVerifyService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
  ) {}

  public async execute(payload: ValidateCopyPayload): Promise<{isValid: boolean, errors: string[]}> {
    const { copyName, domain, sendingDate } = payload;

    const adminConfig =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: "finance",
      });

    const domainsData = await this.getAllMondayDomainsDataService.execute();

    const productsData = await this.getAllMondayProductsDataService.execute();

    const result = await this.qmToolVerifyService.execute({
      copyName,
      domain,
      domainsData,
      productsData,
      adminBroadcastConfig: adminConfig,
      sendingDate,
    });
    return result;
  }
}
