import { ClassProvider } from "@nestjs/common";
import { BigQueryApiService } from "../services";
import { BigQueryApiTokens } from "../bigquery-api.tokens";

export const serviceProviders: ClassProvider[] = [
  {
    provide: BigQueryApiTokens.BigQueryApiService,
    useClass: BigQueryApiService,
  },
];
