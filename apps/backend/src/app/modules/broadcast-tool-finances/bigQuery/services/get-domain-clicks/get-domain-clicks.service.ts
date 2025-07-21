import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { GetDomainClicksResponseDto } from '@epc-services/interface-adapters';
import { Injectable } from '@nestjs/common';
import { CheckDomainClicksPayload } from './get-domain-clicks.payload';

@Injectable()
export class GetDomainClicksService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(
    payload: CheckDomainClicksPayload
  ): Promise<GetDomainClicksResponseDto> {
    const { domain, days } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
        SELECT
            Date, Domain, UC, TC
        FROM \`delta-daylight-316213.developers.base\`
        WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${days} DAY) AND Domain = '${domain}'
        ORDER BY Date DESC
    `,
      });
      return { data };
    } catch (e) {
      return { data: [] };
    }
  }
}
