import { Injectable } from "@nestjs/common";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { RedoBroadcastPayload } from "./redo-broadcast.payload";
import { getDateRange } from "../../utils/getDateRange";
import { GetUnavailableBroadcastCopiesService } from "../get-unavailable-broadcast-copies/get-unavailable-broadcast-copies.service";
import { GetBroadcastRulesByIdQueryService } from "../../../rules/queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { GetAllDomainsService } from "../get-all-domains/get-all-domains.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";

@Injectable()
export class RedoBroadcastService {
  constructor(
    private readonly getUnavailableBroadcastCopiesService: GetUnavailableBroadcastCopiesService,
    private readonly getBroadcastRulesByIdQueryService: GetBroadcastRulesByIdQueryService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    private readonly getBroadcastService: GetAllDomainsService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService
  ) {}
  public async execute(
    payload: RedoBroadcastPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcastRuleId, fromDate, toDate } = payload;

    const dateRange = getDateRange(fromDate, toDate);

    const broadcastRule = await this.getBroadcastRulesByIdQueryService.execute({
      broadcastRulesId: broadcastRuleId,
    });

    const adminConfig =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: "finance",
      });

    const broadcast = await this.getBroadcastService.execute({
      broadcastId: broadcastRule.broadcastSpreadsheetId,
      usageRules: broadcastRule.usageRules,
    });

    const productsData = await this.getAllMondayProductsDataService.execute();

    const unavailableCopies =
      await this.getUnavailableBroadcastCopiesService.execute({
        broadcast,
        dateRange,
        adminBroadcastConfig: adminConfig,
        broadcastRules: broadcastRule,
        productsData
      });
      console.log(unavailableCopies);
    return;
  }
}
