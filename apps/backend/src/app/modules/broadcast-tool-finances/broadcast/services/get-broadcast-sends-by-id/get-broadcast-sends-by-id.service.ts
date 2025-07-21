import { Inject, Injectable } from "@nestjs/common";
import { CalculateBroadcastSendingService } from "../calculate-broadcast-sending/calculate-broadcast-sending.service";
import { GetAllDomainsService } from "../get-all-domains/get-all-domains.service";
import { GetBroadcastsSendsResponseDto } from "@epc-services/interface-adapters";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { GetBroadcastSendsByIdPayload } from "./get-broadcast-sends-by-id.payload";
import { GetBroadcastRulesByIdQueryService } from "../../../rules/queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { getDateRange } from "../../utils/getDateRange";

@Injectable()
export class GetBroadcastsSendsByIdService {
  constructor(
    private readonly calculateBroadcastSendingService: CalculateBroadcastSendingService,
    private readonly getBroadcastService: GetAllDomainsService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    private readonly getBroadcastRulesByIdQueryService: GetBroadcastRulesByIdQueryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}
  public async execute(
    payload: GetBroadcastSendsByIdPayload
  ): Promise<GetBroadcastsSendsResponseDto> {
    const { fromDate, toDate, broadcastRuleId } = payload;

    const cacheKey = `getBroadcastsSendsById:${fromDate}:${toDate}:${broadcastRuleId}`;

    const cached = await this.cacheManager.get<GetBroadcastsSendsResponseDto>(
      cacheKey
    );
    if (cached) return cached;

    const broadcastRule = await this.getBroadcastRulesByIdQueryService.execute({
      broadcastRulesId: broadcastRuleId,
    });

    const result = [];

    const productsData = await this.getAllMondayProductsDataService.execute();

    const broadcast = await this.getBroadcastService.execute({
      broadcastId: broadcastRule.broadcastSpreadsheetId,
      usageRules: {
        productMinDelayPerDays: 3,
        copyMinDelayPerDays: 3,
        copyTabLimit: [],
      },
    });

    const dateRange = getDateRange(fromDate, toDate);
    const sending = await this.calculateBroadcastSendingService.execute({
      broadcast,
      dateRange,
      broadcastName: broadcastRule.name,
      productsData,
    });

    result.push(sending);

    await this.cacheManager.set(cacheKey, { broadcasts: result });
    return { broadcasts: result };
  }
}
