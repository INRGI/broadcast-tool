import { MondayConfigService } from "@epc-services/core";
import { GetProductDataResponse } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { setImmediate } from "timers/promises";

@Injectable()
export class GetAllProductsDataService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<GetProductDataResponse[]> {
    return this.executeInternal(false);
  }

  public async executeWithForceRefresh(): Promise<GetProductDataResponse[]> {
    return this.executeInternal(true);
  }

  public async executeInternal(
    forceRefresh: boolean
  ): Promise<GetProductDataResponse[]> {
    const boardId = Number(this.mondayApiConfig.productsBoardId);
    const cacheKey = `allProductsData:${boardId}`;

    if (!forceRefresh) {
      const cached = await this.cacheManager.get<GetProductDataResponse[]>(
        cacheKey
      );
      if (cached) return cached;
    }

    const result: GetProductDataResponse[] = [];
    let cursor: string | null = null;

    do {
      const query = `
        query ($boardId: ID!, $cursor: String) {
          boards(ids: [$boardId]) {
            items_page(limit: 500, cursor: $cursor) {
              cursor
              items {
                id
                name
                group { title }
                column_values { column { title } text }
              }
            }
          }
        }
      `;

      const variables = { boardId, cursor };
      const { items, cursor: nextCursor } =
        await this.mondayApiService.getItemsWithCursor({ query, variables });

      const chunkResults = await Promise.all(
        items.map(async (item) => {
          const map = new Map(
            item.column_values.map((c) => [c.column.title, c.text])
          );
          const get = (title: string) => map.get(title) ?? null;

          const status = get("Status");
          if (!status || ["Pending", "Closed"].includes(status)) return null;
          if (item.group?.title === "ARCHIVE") return null;

          return {
            productName: item.name,
            productStatus: status,
            broadcastCopies: get("(B)Broadcast Copies"),
            domainSending: get("Domain Sending"),
            sector: get("Sector"),
            partner: item.group?.title ?? null,
          };
        })
      );

      result.push(
        ...(chunkResults.filter(Boolean) as GetProductDataResponse[])
      );

      cursor = nextCursor;

      await setImmediate();
    } while (cursor);

    await this.cacheManager.set(cacheKey, result, 1800000);
    return result;
  }
}
