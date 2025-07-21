import { setImmediate } from "timers/promises";
import { MondayConfigService } from "@epc-services/core";
import { GetProductStatusesResponseDto } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetProductStatusesService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<GetProductStatusesResponseDto> {
    const boardId = Number(this.mondayApiConfig.productsBoardId);
    const cacheKey = `productStatuses:${boardId}`;

    const cached = await this.cacheManager.get<GetProductStatusesResponseDto>(cacheKey);
    if (cached) return cached;

    const uniqueProductStatuses = new Set<string>();
    const uniqueDomainSendings = new Set<string>();
    const uniquePartners = new Set<string>();
    const uniqueSectors = new Set<string>();

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
                group {
                  title
                }
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
          const map = new Map(item.column_values.map((c) => [c.column.title, c.text]));
          const get = (title: string) => map.get(title) ?? null;

          return {
            status: get("Status"),
            domainSending: get("Domain Sending"),
            partner: item.group?.title ?? null,
            sector: get("Sector"),
          };
        })
      );

      for (const { status, domainSending, partner, sector } of chunk) {
        if (status) uniqueProductStatuses.add(status);
        if (domainSending) uniqueDomainSendings.add(domainSending);
        if (partner) uniquePartners.add(partner);
        if (sector) uniqueSectors.add(sector);
      }

      cursor = nextCursor;
      await setImmediate();
    } while (cursor);

    const result: GetProductStatusesResponseDto = {
      productStatuses: Array.from(uniqueProductStatuses),
      domainSendings: Array.from(uniqueDomainSendings),
      partners: Array.from(uniquePartners),
      sectors: Array.from(uniqueSectors),
    };

    await this.cacheManager.set(cacheKey, result, 900000);
    return result;
  }
}

// import { MondayConfigService } from "@epc-services/core";
// import { GetProductStatusesResponseDto } from "@epc-services/interface-adapters";
// import {
//   InjectMondayApiService,
//   MondayApiServicePort,
// } from "@epc-services/monday-api";
// import { Inject, Injectable } from "@nestjs/common";
// import { CACHE_MANAGER } from "@nestjs/cache-manager";
// import { Cache } from "cache-manager";

// @Injectable()
// export class GetProductStatusesService {
//   constructor(
//     @InjectMondayApiService()
//     private readonly mondayApiService: MondayApiServicePort,
//     private readonly mondayApiConfig: MondayConfigService,
//     @Inject(CACHE_MANAGER)
//     private readonly cacheManager: Cache
//   ) {}

//   public async execute(): Promise<GetProductStatusesResponseDto> {
//     const boardId = Number(this.mondayApiConfig.productsBoardId);
//     let cursor: string | null = null;

//     const cacheKey = `productStatuses:${boardId}`;

//     const cached = await this.cacheManager.get<GetProductStatusesResponseDto>(
//       cacheKey
//     );

//     if (cached) return cached;

//     const uniqueProductStatuses = new Set();
//     const uniqueDomainSendings = new Set();
//     const uniquePartners = new Set();
//     const uniqueSectors = new Set();

//     do {
//       const query = `
//           query ($boardId: ID!, $cursor: String) {
//             boards(ids: [$boardId]) {
//               items_page(limit: 500, cursor: $cursor) {
//                 cursor
//                 items {
//                   id
//                   name
//                   group {
//                     title
//                   }
//                   column_values {
//                     column { title }
//                     text
//                   }
//                 }
//               }
//             }
//           }
//         `;

//       const variables = { boardId, cursor };

//       const { items, cursor: nextCursor } =
//         await this.mondayApiService.getItemsWithCursor({ query, variables });

//       for (const item of items) {
//         const get = (title: string): string | null =>
//           item.column_values.find((c) => c.column.title === title)?.text ??
//           null;

//         uniqueProductStatuses.add(get("Status"));
//         uniqueDomainSendings.add(get("Domain Sending"));
//         uniquePartners.add(item.group?.title);
//         uniqueSectors.add(get("Sector"));
//       }

//       cursor = nextCursor;
//     } while (cursor);

//     const result = {
//       productStatuses: Array.from(uniqueProductStatuses) as string[],
//       domainSendings: Array.from(uniqueDomainSendings) as string[],
//       partners: Array.from(uniquePartners) as string[],
//       sectors: Array.from(uniqueSectors) as string[],
//     };

//     await this.cacheManager.set(cacheKey, result, 900000);
//     return result;
//   }
// }
