import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetAllProductsDataService } from "../../../modules/broadcast-tool-finances/monday/services/get-all-products-data/get-all-products-data.service";

@Injectable()
export class GetAllProductsDataTaskScheduler implements OnApplicationBootstrap{
  private readonly logger: Logger = new Logger(
    GetAllProductsDataTaskScheduler.name,
    {
      timestamp: true,
    }
  );

  constructor(
    private readonly getAllProductsDataService: GetAllProductsDataService
  ) {}

  async onApplicationBootstrap() {
    await this.execute();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async execute(): Promise<void> {
    try {
      this.logger.log("GetAllProductsDataTaskScheduler started");

      const result =
        await this.getAllProductsDataService.executeWithForceRefresh();

      this.logger.log(
        `GetAllProductsDataTaskScheduler finished: ${result.length}`
      );
    } catch (error) {
      this.logger.error("GetAllProductsDataTaskScheduler failed", error);
    }
  }
}
