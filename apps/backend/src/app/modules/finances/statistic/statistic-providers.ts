import { Provider } from "@nestjs/common";
import { StatisticController } from "./controllers/statistic.controller";

export const messageControllers = [StatisticController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [];
