import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { GetAllDataResponseDto } from '@epc-services/interface-adapters';
import { Injectable } from '@nestjs/common';
import { GetDataByIntervalPayload } from './get-all-data-by-interval.payload';

@Injectable()
export class GetAllDataByIntervalService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(
    payload: GetDataByIntervalPayload
  ): Promise<GetAllDataResponseDto> {
    const { daysBefore } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
        SELECT
        Date, Company, Domain, Type, Copy, Offer, Month,
        ISP, UC, TC, Conversion
        FROM \`delta-daylight-316213.developers.base\`
        WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY)
        ORDER BY Date DESC
    `,
      });
      return { data };
    } catch (e) {
      return { data: [] };
    }
  }
}
