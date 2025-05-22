import { GetStatsParams, BigQueryRow } from "../interfaces";

export interface BigQueryApiServicePort{
    getStats(params: GetStatsParams): Promise<BigQueryRow[]>
}