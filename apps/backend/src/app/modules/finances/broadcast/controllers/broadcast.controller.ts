import { Controller, Get, Param } from "@nestjs/common";
import { GetAllDomainsService } from "../services/get-all-domains/get-all-domains.service";
import { GetAllDomainsResponse } from "@epc-services/interface-adapters";

@Controller("finances/broadcast")
export class BroadcastController {
  constructor(private readonly getAllDomainsService: GetAllDomainsService) {}

  @Get(":team")
  public async getAllDomains(
    @Param("team") team: string
  ): Promise<GetAllDomainsResponse> {
    const result = await this.getAllDomainsService.getDomains({
      broadcastTeam: team,
    });

    return await result;
  }
}
