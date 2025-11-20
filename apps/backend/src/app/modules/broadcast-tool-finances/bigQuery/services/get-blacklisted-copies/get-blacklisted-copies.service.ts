import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from "@epc-services/bigquery-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetBlacklistedCopiesService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<string[]> {
    const cacheKey = `blacklistedCopies`;

    const cached = await this.cacheManager.get<string[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
             SELECT Copy
             FROM \`delta-daylight-316213.developers.blacklist_copy\`
         `,
      });
      const result = data.map((d) => d.Copy);

      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch {
      return [];
    }
  }
}
