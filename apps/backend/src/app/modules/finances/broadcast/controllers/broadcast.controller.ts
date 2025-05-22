import { Controller, Get, Param } from "@nestjs/common";
import { GetAllDomainsService } from "../services/get-all-domains/get-all-domains.service";
import { GetAllDomainsResponse } from "@epc-services/interface-adapters";
import {
  InjectBigQueryApiService,
  BigQueryApiServicePort,
} from "@epc-services/bigquery-api";

@Controller("finances/broadcast")
export class BroadcastController {
  constructor(
    private readonly getAllDomainsService: GetAllDomainsService,
    @InjectBigQueryApiService()
    private readonly statisticApiService: BigQueryApiServicePort
  ) {}

  @Get(":team")
  public async getAllDomains(
    @Param("team") team: string
  ): Promise<GetAllDomainsResponse> {
    const result = await this.getAllDomainsService.getDomains({
      broadcastTeam: team,
    });
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const from = weekAgo.toISOString().split("T")[0]; // формат YYYY-MM-DD
    const to = today.toISOString().split("T")[0];

    const test = await this.statisticApiService.getStats({ from, to });
    // console.log(test);
    return await result;
  }
}
