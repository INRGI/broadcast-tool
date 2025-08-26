import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetAllDomainsDataService } from "../../../modules/broadcast-tool-finances/monday/services/get-all-domains-data/get-all-domains-data.service";

@Injectable()
export class GetAllDomainsDataTaskScheduler implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(
    GetAllDomainsDataTaskScheduler.name,
    {
      timestamp: true,
    }
  );

  constructor(
    private readonly getAllDomainsDataService: GetAllDomainsDataService
  ) {}

  async onApplicationBootstrap() {
    await this.execute();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async execute(): Promise<void> {
    try {
      this.logger.log("GetAllDomainsDataTaskScheduler started");

      const result =
        await this.getAllDomainsDataService.executeWithForceRefresh();

      this.logger.log(
        `GetAllDomainsDataTaskScheduler finished: ${result.length}`
      );
    } catch (error) {
      this.logger.error("GetAllDomainsDataTaskScheduler failed", error);
    }
  }
}
