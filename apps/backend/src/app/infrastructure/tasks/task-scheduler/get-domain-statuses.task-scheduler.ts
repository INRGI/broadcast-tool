import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetDomainStatusesService } from "../../../modules/broadcast-tool-finances/monday/services/get-domain-statuses/get-domain-statuses.service";

@Injectable()
export class GetDomainStatusesTaskScheduler implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(
    GetDomainStatusesTaskScheduler.name,
    {
      timestamp: true,
    }
  );

  constructor(
    private readonly getDomainStatusesService: GetDomainStatusesService
  ) {}

  async onApplicationBootstrap() {
    await this.execute();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async execute(): Promise<void> {
    try {
      this.logger.log("GetDomainStatusesTaskScheduler started");

      await this.getDomainStatusesService.executeWithForceRefresh();

      this.logger.log(`GetDomainStatusesTaskScheduler finished`);
    } catch (error) {
      this.logger.error("GetDomainStatusesTaskScheduler failed", error);
    }
  }
}
