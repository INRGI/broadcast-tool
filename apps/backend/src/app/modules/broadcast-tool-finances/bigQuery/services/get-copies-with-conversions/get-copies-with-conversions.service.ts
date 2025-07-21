import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from "@epc-services/bigquery-api";
import { Inject, Injectable } from "@nestjs/common";
import { GetCopiesWithConversionsPayload } from "./get-copies-with-conversions.payload";
import { GetCopiesWithConversionsResponseDto } from "@epc-services/interface-adapters";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetCopiesWithConversionsService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(
    payload: GetCopiesWithConversionsPayload
  ): Promise<GetCopiesWithConversionsResponseDto> {
    const { daysBefore } = payload;
    const cacheKey = `copiesForConversions:${daysBefore}`;

    const cached =
      await this.cacheManager.get<GetCopiesWithConversionsResponseDto>(
        cacheKey
      );
    if (cached) return cached;

    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
           SELECT MAX(Date) as Date, 
           Copy, 
           SUM(UC) as UC,
           SUM(Conversion) as Conversion
           FROM \`delta-daylight-316213.developers.base\`
           WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
           AND Conversion > 0
           GROUP BY Copy
           ORDER BY Conversion DESC
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
