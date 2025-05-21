import { Injectable } from "@nestjs/common";
import { StatisticConfigService } from "@epc-services/core";
import { StatisticApiModuleOptions } from "@epc-services/statistic-api";
@Injectable()
export class StatisticApiOptionsFactoryService {
  constructor(private readonly statisticApiConfig: StatisticConfigService) {}

  create(): Promise<StatisticApiModuleOptions> | StatisticApiModuleOptions {
    return {
      client_email: this.statisticApiConfig.statisticClientEmail,
      private_key: this.statisticApiConfig.statisticPrivateKey
        .split("\\n")
        .join("\n"),
      projectId: this.statisticApiConfig.statisticProjectId,
    };
  }
}
