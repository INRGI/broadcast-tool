import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from "@epc-services/bigquery-api";
import { Inject, Injectable } from "@nestjs/common";
import { GetCopiesWithSendsResponseDto } from "@epc-services/interface-adapters";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { GetClickCopiesWithSendsPayload } from "./get-click-copies-with-sends.payload";

@Injectable()
export class GetClickCopiesWithSendsService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(
    payload: GetClickCopiesWithSendsPayload
  ): Promise<GetCopiesWithSendsResponseDto> {
    const { daysBefore } = payload;
    const cacheKey = `clickCopiesWithSends:${daysBefore}`;

    const cached = await this.cacheManager.get<GetCopiesWithSendsResponseDto>(
      cacheKey
    );

    if (cached) return cached;

    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
          SELECT MAX(Date) as Date, 
          Copy, 
          SUM(UC) as UC,
          SUM(Sends) as Sends,
          FROM \`delta-daylight-316213.developers.sends\`
          WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
          AND UC > 0
          GROUP BY Copy
          ORDER BY Sends DESC
      `,
      });

      const result = { data } as GetCopiesWithSendsResponseDto;
      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch (e) {
      return { data: [] };
    }
  }
}
