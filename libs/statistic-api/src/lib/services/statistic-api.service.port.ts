import { GetStatsParams, StatisticRow } from "../interfaces";

export interface StatisticApiServicePort{
    getStats(params: GetStatsParams): Promise<StatisticRow[]>
}