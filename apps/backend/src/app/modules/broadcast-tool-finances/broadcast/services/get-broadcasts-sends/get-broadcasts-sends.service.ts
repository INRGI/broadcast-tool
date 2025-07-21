import { Inject, Injectable } from "@nestjs/common";
import { CalculateBroadcastSendingService } from "../calculate-broadcast-sending/calculate-broadcast-sending.service";
import { GetAllDomainsService } from "../get-all-domains/get-all-domains.service";
import { GetBroadcastsListService } from "../get-broadcasts-list/get-broadcasts-list.service";
import { GetBroadcastsSendsPayload } from "./get-broadcasts-sends.payload";
import { GetBroadcastsSendsResponseDto } from "@epc-services/interface-adapters";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { getDateRange } from "../../utils/getDateRange";

@Injectable()
export class GetBroadcastsSendsService {
  constructor(
    private readonly calculateBroadcastSendingService: CalculateBroadcastSendingService,
    private readonly getBroadcastService: GetAllDomainsService,
    private readonly getBroadcastsListService: GetBroadcastsListService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}
  public async execute(
    payload: GetBroadcastsSendsPayload
  ): Promise<GetBroadcastsSendsResponseDto> {
    const { fromDate, toDate } = payload;

    const cacheKey = `getBroadcastsSends:${fromDate}:${toDate}`;

    const cached = await this.cacheManager.get<GetBroadcastsSendsResponseDto>(
      cacheKey
    );
    if (cached) return cached;

    const IGNORED_BROADCASTS = [
      "Broadcast Intern team",
      "Broadcast OptimizedWarsaw Team",
    ];

    const result = [];
    const broadcastsList = await this.getBroadcastsListService.execute();
    const productsData = await this.getAllMondayProductsDataService.execute();

    for (const sheet of broadcastsList.sheets) {
      if (IGNORED_BROADCASTS.includes(sheet.sheetName)) {
        continue;
      }
      const broadcast = await this.getBroadcastService.execute({
        broadcastId: sheet.fileId,
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
        broadcastName: sheet.sheetName,
        productsData,
      });

      result.push(sending);
    }
    await this.cacheManager.set(cacheKey, { broadcasts: result });
    return { broadcasts: result };
  }
}
