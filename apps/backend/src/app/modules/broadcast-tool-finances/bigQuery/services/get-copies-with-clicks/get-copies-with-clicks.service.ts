import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from "@epc-services/bigquery-api";
import { Inject, Injectable } from "@nestjs/common";
import { GetCopiesWithClicksPayload } from "./get-copies-with-clicks.payload";
import { GetCopiesWithClicksResponseDto } from "@epc-services/interface-adapters";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetCopiesWithClicksService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(
    payload: GetCopiesWithClicksPayload
  ): Promise<GetCopiesWithClicksResponseDto> {
    const { daysBefore } = payload;
    const cacheKey = `copiesForClicks:${daysBefore}`;

    const cached = await this.cacheManager.get<GetCopiesWithClicksResponseDto>(
      cacheKey
    );
    if (cached) return cached;

    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
        SELECT MAX(Date) as Date, 
        Copy, 
        SUM(UC) as UC, 
        SUM(TC) as TC
        FROM \`delta-daylight-316213.developers.base\`
        WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
        AND UC > 0
        GROUP BY Copy
        ORDER BY UC DESC
    `,
      });
      const result = { data };

      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch (e) {
      return { data: [] };
    }
  }
}
