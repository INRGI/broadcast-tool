import { BigQuery } from "@google-cloud/bigquery";
import { Inject, Injectable } from "@nestjs/common";
import { StatisticApiConnectionOptions } from "../interfaces/statistic-api.options.interface";
import { StatisticApiTokens } from "../statistic-api.tokens";
import { StatisticApiServicePort } from "./statistic-api.service.port";
import { GetStatsParams, StatisticRow } from "../interfaces";

@Injectable()
export class StatisticApiService implements StatisticApiServicePort {
  constructor(
    @Inject(StatisticApiTokens.StatisticApiModuleOptions)
    private readonly options: StatisticApiConnectionOptions
  ) {}

  public async getStats(params: GetStatsParams = {}): Promise<StatisticRow[]> {
    const { from, to, company } = params;

    const bigquery = await this.createClient();
    const where: string[] = [];

    if (from) where.push(`Date >= "${from}"`);
    if (to) where.push(`Date <= "${to}"`);
    if (company) where.push(`Company = "${company}"`);

    const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT
        Date, Company, Domain, Type, Copy, Offer, Month,
        ISP, UC, TC, Conversion
      FROM \`delta-daylight-316213.copymaker.base\`
      ${whereClause}
      ORDER BY Date DESC
      LIMIT 200
    `;

    const [rows] = await bigquery.query({ query });
    return rows as StatisticRow[];
  }

  private async createClient(): Promise<BigQuery> {
    const bigquery = new BigQuery({
        projectId: this.options.projectId,
        credentials: {
          client_email: this.options.client_email,
          private_key: this.options.private_key,
        },
      });

    return bigquery;
  }
}
