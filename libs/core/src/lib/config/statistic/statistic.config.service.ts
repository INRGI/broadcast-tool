import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StatisticConfigService {
  constructor(private configService: ConfigService) {}

  get statisticClientEmail(): string {
    return this.configService.get<string>("statistic.clientEmail");
  }

  get statisticPrivateKey(): string {
    return this.configService.get<string>("statistic.privateKey");
  }

  get statisticProjectId(): string {
    return this.configService.get<string>("statistic.projectId");
  }
}
