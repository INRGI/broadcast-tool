import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from "@epc-services/bigquery-api";
import { Inject, Injectable } from "@nestjs/common";
import { GetCopiesForTestPayload } from "./get-copies-for-test.payload";
import { GetCopiesWithSendsResponseDto } from "@epc-services/interface-adapters";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetCopiesForTestService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(
    payload: GetCopiesForTestPayload
  ): Promise<GetCopiesWithSendsResponseDto> {
    const { daysBefore } = payload;
    const cacheKey = `copiesForTest:${daysBefore}`;

    const cached = await this.cacheManager.get<GetCopiesWithSendsResponseDto>(
      cacheKey
    );

    if (cached) return cached;

    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
        SELECT MAX(Date) as Date, 
        Copy, 
        SUM(Sends) as Sends,
        FROM \`delta-daylight-316213.developers.sends\`
        WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
        GROUP BY Copy
        ORDER BY Sends DESC
    `,
      });

      const grouped = new Map<string, (typeof data)[0]>();

      for (const entry of data) {
        if (!entry.Copy || entry.Copy.includes("_SA")) continue;
        const baseCopy = this.cleanBaseCopy(entry.Copy);
        if (!baseCopy) continue;

        const current = grouped.get(baseCopy);

        if (current) {
          current.Sends += entry.Sends;
        } else {
          grouped.set(baseCopy, {
            ...entry,
            Copy: baseCopy,
          });
        }
      }

      const result = {
        data: Array.from(grouped.values()),
      } as GetCopiesWithSendsResponseDto;

      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch (e) {
      return { data: [] };
    }
  }

  private cleanBaseCopy(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
