import { setImmediate } from "timers/promises";
import { MondayConfigService } from "@epc-services/core";
import { GetDomainStatusesResponseDto } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetDomainStatusesService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<GetDomainStatusesResponseDto> {
    return this.executeInternal(false);
  }

  public async executeWithForceRefresh(): Promise<GetDomainStatusesResponseDto> {
    return this.executeInternal(true);
  }

  public async executeInternal(
    forceRefresh: boolean
  ): Promise<GetDomainStatusesResponseDto> {
    const boardId = Number(this.mondayApiConfig.domainsBoardId);
    const cacheKey = `domainStatuses:${boardId}`;

    if (!forceRefresh) {
      const cached = await this.cacheManager.get<GetDomainStatusesResponseDto>(
        cacheKey
      );
      if (cached) return cached;
    }

    const uniqueDomainStatuses = new Set<string>();
    const uniqueParentCompanies = new Set<string>();
    const uniqueEsps = new Set<string>();

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

      const itemData = await Promise.all(
        items.map(async (item) => {
          const map = new Map(
            item.column_values.map((c) => [c.column.title, c.text])
          );
          const get = (title: string) => map.get(title) ?? null;

          return {
            status: get("Status"),
            parentCompany: get("Parent Company"),
            esp: get("ESP"),
          };
        })
      );

      for (const { status, parentCompany, esp } of itemData) {
        if (status) uniqueDomainStatuses.add(status);
        if (parentCompany) uniqueParentCompanies.add(parentCompany);
        if (esp) uniqueEsps.add(esp);
      }

      cursor = nextCursor;

      await setImmediate();
    } while (cursor);

    const result: GetDomainStatusesResponseDto = {
      uniqueDomainStatuses: Array.from(uniqueDomainStatuses),
      uniqueParentCompanies: Array.from(uniqueParentCompanies),
      uniqueEsps: Array.from(uniqueEsps),
    };

    await this.cacheManager.set(cacheKey, result, 1800000);

    return result;
  }
}
