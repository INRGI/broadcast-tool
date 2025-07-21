import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { GetAllDataResponseDto } from '@epc-services/interface-adapters';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllDataService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(): Promise<GetAllDataResponseDto> {
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: this.query,
      });
      return { data };
    } catch (e) {
      return { data: [] };
    }
  }

  private readonly query = `
    SELECT
        Date, Company, Domain, Type, Copy, Offer, Month,
        ISP, UC, TC, Conversion
    FROM \`delta-daylight-316213.developers.base\`
    ORDER BY Date DESC
    `;
}
