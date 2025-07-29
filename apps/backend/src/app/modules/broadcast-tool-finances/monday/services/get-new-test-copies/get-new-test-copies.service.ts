import { setImmediate } from "timers/promises";
import { MondayConfigService } from "@epc-services/core";
import { GetTestCopyResponseDto } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { GetNewTestCopiesPayload } from "./get-new-test-copies.payload";

@Injectable()
export class GetNewTestCopiesService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(
    payload: GetNewTestCopiesPayload
  ): Promise<GetTestCopyResponseDto[]> {
    const { newTestCopiesGroupNames } = payload;
    if (!newTestCopiesGroupNames.length) return [];
    const boardId = Number(this.mondayApiConfig.testCopiesBoardId);
    const cacheKey = `newTestCopies:${boardId}`;

    const cached = await this.cacheManager.get<GetTestCopyResponseDto[]>(
      cacheKey
    );
    if (cached) return cached;

    const findGroupsQuery = `
      query ($boardId: ID!) {
        boards(ids: [$boardId]) {
          groups {
            id
            title
          }
        }
      }
    `;

    const groups = await this.mondayApiService.getGroupsByQuery({
      query: findGroupsQuery,
      variables: { boardId },
    });

    const result: GetTestCopyResponseDto[] = [];
    let cursor: string | null = null;

    for (const groupName of newTestCopiesGroupNames) {
      const archiveGroupId = groups.find(
        (g) => g.title.trim().toLowerCase() === groupName.trim().toLowerCase()
      )?.id;
      if (!archiveGroupId) continue;
      
      do {
        const query = `
        query ($boardId: ID!, $groupId: [String!], $cursor: String) {
          boards(ids: [$boardId]) {
            groups(ids: $groupId) {
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
        }
      `;

        const variables = { boardId, groupId: archiveGroupId, cursor };

        const { items, cursor: nextCursor } =
          await this.mondayApiService.getGroupItemsWithCursor({
            query,
            variables,
          });

        const chunk = await Promise.all(
          items.map(async (item) => {
            if (item.name.endsWith(" SA")) return null;

            const map = new Map(
              item.column_values.map((c) => [c.column.title, c.text])
            );
            const get = (title: string) => map.get(title) ?? null;

            return {
              copyName: item.name,
              checkStatus: get("Check Status"),
              createDate: get("Create Date"),
            };
          })
        );

        result.push(...(chunk.filter(Boolean) as GetTestCopyResponseDto[]));

        cursor = nextCursor;

        await setImmediate();
      } while (cursor);
    }

    await this.cacheManager.set(cacheKey, result, 900000);
    return result;
  }
}
