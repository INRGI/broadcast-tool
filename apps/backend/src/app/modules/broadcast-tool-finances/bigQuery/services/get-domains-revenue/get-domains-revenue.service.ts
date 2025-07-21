import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { Injectable } from '@nestjs/common';
import { GetDomainsRevenuePayload } from './get-domains-revenue.payload';
import { GetDomainsRevenueResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class GetDomainsRevenueService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(
    payload: GetDomainsRevenuePayload
  ): Promise<GetDomainsRevenueResponseDto> {
    const { days } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
         SELECT
            Domain,
            SUM(UC) AS UC,
            SUM(Conversion) AS Conversion,
          FROM \`delta-daylight-316213.developers.base\`
          WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${days} DAY)
          GROUP BY Domain
        `,
      });

      return { data };
    } catch (e) {
      return { data: [] };
    }
  }
}
