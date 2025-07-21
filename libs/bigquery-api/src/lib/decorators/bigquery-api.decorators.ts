import { Inject } from "@nestjs/common";
import { BigQueryApiTokens } from "../bigquery-api.tokens";

export const InjectBigQueryApiService = (): ReturnType<typeof Inject> =>
  Inject(BigQueryApiTokens.BigQueryApiService);
