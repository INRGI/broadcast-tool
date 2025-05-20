import { Inject } from "@nestjs/common";
import { StatisticApiTokens } from "../statistic-api.tokens";

export const InjectStatisticApiService = (): ReturnType<typeof Inject> =>
  Inject(StatisticApiTokens.StatisticApiService);
