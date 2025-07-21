import { Provider } from "@nestjs/common";
import { GetAllDataService } from "./services/get-all-data/get-all-data.service";
import { GetAllDataByIntervalService } from "./services/get-all-data-by-interval/get-all-data-by-interval.service";
import { GetDomainClicksService } from "./services/get-domain-clicks/get-domain-clicks.service";
import { GetCopyClicksService } from "./services/get-copy-clicks/get-copy-clicks.service";
import { GetCopiesWithClicksService } from "./services/get-copies-with-clicks/get-copies-with-clicks.service";
import { GetCopiesWithConversionsService } from "./services/get-copies-with-conversions/get-copies-with-conversions.service";
import { GetDomainsRevenueService } from "./services/get-domains-revenue/get-domains-revenue.service";
import { GetCopiesWarmupService } from "./services/get-copies-warmup/get-copies-warmup.service";
import { GetCopiesForTestService } from "./services/get-copies-for-test/get-copies-for-test.service";
import { GetClickCopiesWithSendsService } from "./services/get-click-copies-with-sends/get-click-copies-with-sends.service";

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetAllDataService,
  GetAllDataByIntervalService,
  GetDomainClicksService,
  GetCopyClicksService,
  GetCopiesWithClicksService,
  GetCopiesWithConversionsService,
  GetCopiesWarmupService,
  GetDomainsRevenueService,
  GetCopiesForTestService,
  GetClickCopiesWithSendsService,
];
