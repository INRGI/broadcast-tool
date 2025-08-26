import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetProductStatusesService } from "../../../modules/broadcast-tool-finances/monday/services/get-product-statuses/get-product-statuses.service";

@Injectable()
export class GetProductStatusesTaskScheduler implements OnApplicationBootstrap{
  private readonly logger: Logger = new Logger(
    GetProductStatusesTaskScheduler.name,
    {
      timestamp: true,
    }
  );

  constructor(
    private readonly getProductStatusesService: GetProductStatusesService
  ) {}

  async onApplicationBootstrap() {
    await this.execute();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async execute(): Promise<void> {
    try {
      this.logger.log("GetProductStatusesTaskScheduler started");

      await this.getProductStatusesService.executeWithForceRefresh();

      this.logger.log(`GetProductStatusesTaskScheduler finished`);
    } catch (error) {
      this.logger.error("GetProductStatusesTaskScheduler failed", error);
    }
  }
}
