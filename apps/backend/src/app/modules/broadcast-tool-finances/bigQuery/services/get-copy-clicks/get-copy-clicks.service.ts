import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { Injectable } from '@nestjs/common';
import { GetCopyClicksPayload } from './get-copy-clicks.payload';
import { GetCopyClicksResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class GetCopyClicksService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(
    payload: GetCopyClicksPayload
  ): Promise<GetCopyClicksResponseDto> {
    const { copyName } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
              SELECT
                  Date, Copy, UC, TC
              FROM \`delta-daylight-316213.developers.base\`
              WHERE Copy like '${copyName}%'
              ORDER BY Date DESC
          `,
      });
      return { data };
    } catch (e) {
      return { data: [] };
    }
  }
}
