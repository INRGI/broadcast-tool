import { BigQuery } from "@google-cloud/bigquery";
import { Inject, Injectable } from "@nestjs/common";
import { BigQueryApiTokens } from "../bigquery-api.tokens";
import { GetStatsParams, BigQueryRow, BigQueryApiConnectionOptions } from "../interfaces";
import { BigQueryApiServicePort } from "./bigquery-api.service.port";

@Injectable()
export class BigQueryApiService implements BigQueryApiServicePort {
  constructor(
    @Inject(BigQueryApiTokens.BigQueryApiModuleOptions)
    private readonly options: BigQueryApiConnectionOptions
  ) {}

  public async getStats(params: GetStatsParams = {}): Promise<BigQueryRow[]> {
    const { from, to, company } = params;

    const bigquery = await this.createClient();
    const where: string[] = [];

    if (from) where.push(`Date >= "${from}"`);
    if (to) where.push(`Date <= "${to}"`);
    if (company) where.push(`Company = "${company}"`);

    const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT
        Date, Type, Copy, Offer, Month,
        ISP, UC, TC, Conversion
      FROM \`${this.options.projectId}.developers.base\`
      ${whereClause}
      ORDER BY Date DESC
    `;

    const [rows] = await bigquery.query({ query });
    return rows as BigQueryRow[];
  }

  private async createClient(): Promise<BigQuery> {
    const bigquery = new BigQuery({
        credentials: {
          client_email: this.options.client_email,
          private_key: this.options.private_key,
        },
        projectId: this.options.projectId,
      });
    return bigquery;
  }
}
