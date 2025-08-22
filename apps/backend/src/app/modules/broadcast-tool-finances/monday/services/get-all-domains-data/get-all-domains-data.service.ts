import { setImmediate } from "timers/promises";
import { MondayConfigService } from "@epc-services/core";
import { GetDomainDataResponse } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetAllDomainsDataService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<GetDomainDataResponse[]> {
    return this.executeInternal(false);
  }

  public async executeWithForceRefresh(): Promise<GetDomainDataResponse[]> {
    return this.executeInternal(true);
  }

  private async executeInternal(
    forceRefresh: boolean
  ): Promise<GetDomainDataResponse[]> {
    const boardId = Number(this.mondayApiConfig.domainsBoardId);
    const cacheKey = `allDomainsData:${boardId}`;

    if (!forceRefresh) {
      const cached = await this.cacheManager.get<GetDomainDataResponse[]>(
        cacheKey
      );
      if (cached) return cached;
    }

    const result: GetDomainDataResponse[] = [];
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
                column_values {
                  column { title }
                  text
                }
              }
            }
          }
        }
      `;

      const variables = { boardId, cursor };
      const { items, cursor: nextCursor } =
        await this.mondayApiService.getItemsWithCursor({ query, variables });

      const chunk = await Promise.all(
        items.map(async (item) => {
          const map = new Map(
            item.column_values.map((c) => [c.column.title, c.text])
          );
          const get = (title: string) => map.get(title) ?? null;

          const status = get("Status");
          if (
            !status ||
            !["Live", "Killing", "Warm Up", "Hold"].includes(status)
          )
            return null;

          return {
            domainName: item.name,
            domainStatus: status,
            parentCompany: get("Parent Company"),
            domainEsp: get("ESP"),
          };
        })
      );

      result.push(...(chunk.filter(Boolean) as GetDomainDataResponse[]));

      cursor = nextCursor;

      await setImmediate();
    } while (cursor);

    await this.cacheManager.set(cacheKey, result, 1800000);
    return result;
  }
}
