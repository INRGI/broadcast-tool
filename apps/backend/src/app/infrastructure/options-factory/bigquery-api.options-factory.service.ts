import { Injectable } from "@nestjs/common";
import { BigQueryConfigService } from "@epc-services/core";
import { BigQueryApiModuleOptions } from "@epc-services/bigquery-api";
@Injectable()
export class BigQueryApiOptionsFactoryService {
  constructor(private readonly statisticApiConfig: BigQueryConfigService) {}

  create(): Promise<BigQueryApiModuleOptions> | BigQueryApiModuleOptions {
    return {
      client_email: this.statisticApiConfig.bigqueryClientEmail,
      private_key: this.statisticApiConfig.bigqueryPrivateKey
        .split("\\n")
        .join("\n"),
      projectId: this.statisticApiConfig.bigqueryProjectId,
    };
  }
}
