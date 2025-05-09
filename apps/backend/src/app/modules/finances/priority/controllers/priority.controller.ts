import { Controller, Get, Param } from "@nestjs/common";
import { CheckForPriorityService } from "../services/check-for-priority/check-for-priority.service";
import { CheckAllForPriorityService } from "../services/check-all-for-priority/check-all-for-priority.service";

@Controller("finances/priority")
export class PriorityController {
  constructor(
    private readonly checkForPriorityService: CheckForPriorityService,
    private readonly checkAllForPriorityService: CheckAllForPriorityService,
  ) {}

  @Get("product/:product")
  public async checkForPriority(
    @Param("product") product: string
  ): Promise<boolean> {
    const result = await this.checkForPriorityService.checkForPriority({
      product,
    });

    return await result;
  }
}
