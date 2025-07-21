import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import {
  AdminBroadcastConfigResponseDto,
  CreateAdminBroadcastConfigRequestDto,
  UpdateAdminBroadcastConfigRequestDto,
} from "@epc-services/interface-adapters";
import { UpdateAdminBroadcastConfigService } from "../commands/update-admin-broadcast-config/update-admin-broadcast-config.service";
import { CreateAdminBroadcastConfigService } from "../commands/create-admin-broadcast-config/create-admin-broadcast-config.service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";

@Controller("finances/broadcast-tool/admin-broadcast-config")
export class AdminBroadcastConfigMessageController {
  constructor(
    private readonly createAdminBroadcastConfigService: CreateAdminBroadcastConfigService,
    private readonly updateAdminBroadcastConfigService: UpdateAdminBroadcastConfigService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService
  ) {}

  @Get(":niche")
  public async getAdminBroadcastConfigByNiche(
    @Param("niche") niche: string
  ): Promise<AdminBroadcastConfigResponseDto> {
    const result =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: niche,
      });
    return result;
  }

  @Put("update")
  public async updateAdminBroadcastConfigRules(
    @Body() body: UpdateAdminBroadcastConfigRequestDto
  ): Promise<AdminBroadcastConfigResponseDto> {
    const entity = await this.updateAdminBroadcastConfigService.execute(body);
    return entity;
  }

  @Post("create")
  public async createAdminBroadcastConfigRules(
    @Body() body: CreateAdminBroadcastConfigRequestDto
  ): Promise<AdminBroadcastConfigResponseDto> {
    const result = await this.createAdminBroadcastConfigService.execute(body);
    return result;
  }
}
