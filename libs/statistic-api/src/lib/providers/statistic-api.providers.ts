import { ClassProvider } from "@nestjs/common";
import { StatisticApiService } from "../services";
import { StatisticApiTokens } from "../statistic-api.tokens";

export const serviceProviders: ClassProvider[] = [
  {
    provide: StatisticApiTokens.StatisticApiService,
    useClass: StatisticApiService,
  },
];
