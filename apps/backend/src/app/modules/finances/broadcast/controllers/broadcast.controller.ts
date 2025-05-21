import { Controller, Get, Param } from "@nestjs/common";
import { GetAllDomainsService } from "../services/get-all-domains/get-all-domains.service";
import { GetAllDomainsResponse } from "@epc-services/interface-adapters";
import {
  InjectStatisticApiService,
  StatisticApiServicePort,
} from "@epc-services/statistic-api";

@Controller("finances/broadcast")
export class BroadcastController {
  constructor(
    private readonly getAllDomainsService: GetAllDomainsService,
    @InjectStatisticApiService()
    private readonly statisticApiService: StatisticApiServicePort
  ) {}

  @Get(":team")
  public async getAllDomains(
    @Param("team") team: string
  ): Promise<GetAllDomainsResponse> {
    const result = await this.getAllDomainsService.getDomains({
      broadcastTeam: team,
    });
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);

    const from = twoWeeksAgo.toISOString().split("T")[0]; // формат YYYY-MM-DD
    const to = today.toISOString().split("T")[0];

    const test = await this.statisticApiService.getStats({ from, to });
    console.log(test);
    return await result;
  }
}
