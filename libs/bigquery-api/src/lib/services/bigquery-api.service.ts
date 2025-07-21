import { Inject, Injectable } from '@nestjs/common';
import { bigquery_v2, google } from 'googleapis';
import { BigQueryApiServicePort } from './bigquery-api.service.port';
import {
  BigQueryApiConnectionOptions,
  BigQueryApiServiceGetDatasetDataByQueryRequest,
  BigQueryRow,
} from '../interfaces';
import { BigQueryApiTokens } from '../bigquery-api.tokens';
import { BIGQUERY_API_SCOPE_URL } from '../constants';

@Injectable()
export class BigQueryApiService implements BigQueryApiServicePort {
  constructor(
    @Inject(BigQueryApiTokens.BigQueryApiModuleOptions)
    private readonly options: BigQueryApiConnectionOptions
  ) {}

  public async getDatasetDataByQuery(
    data: BigQueryApiServiceGetDatasetDataByQueryRequest
  ): Promise<BigQueryRow[]> {
    const client = await this.createClient();
    const { query } = data;

    const queryResponse = await client.jobs.query({
      projectId: this.options.projectId,
      requestBody: {
        query,
        useLegacySql: false,
      },
    });

    const job = queryResponse.data;
    const jobId = job.jobReference?.jobId;
    const projectId = job.jobReference?.projectId;

    if (!jobId || !projectId) {
      throw new Error('Missing jobReference in BigQuery response.');
    }

    const result = await client.jobs.getQueryResults({
      projectId,
      jobId,
    });

    const rows = result.data.rows || [];
    const fields = result.data.schema?.fields || [];

    const parsed: BigQueryRow[] = rows.map((row) => {
      const obj: Partial<BigQueryRow> = {};
      row.f?.forEach((field, i) => {
        const key = fields[i].name as keyof BigQueryRow;
        const value = field.v;

        if (key === 'UC' || key === 'TC' || key === 'Conversion' || key === 'Sends') {
          obj[key] = Number(value);
        } else {
          obj[key] = value;
        }
      });
      return obj as BigQueryRow;
    });

    return parsed;
  }

  private async createClient(): Promise<bigquery_v2.Bigquery> {
    const jwtAuth = new google.auth.JWT(
      this.options.client_email,
      undefined,
      this.options.private_key,
      [BIGQUERY_API_SCOPE_URL]
    );

    await jwtAuth.authorize();

    return google.bigquery({
      version: 'v2',
      auth: jwtAuth,
    });
  }
}
