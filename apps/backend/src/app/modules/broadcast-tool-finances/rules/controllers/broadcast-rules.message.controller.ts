import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { GetPaginatedBroadcastRulesQueryService } from "../queries/get-paginated-broadcast-rules/get-paginated-broadcast-rules.query-service";
import { GetBroadcastRulesByIdQueryService } from "../queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { UpdateBroadcastRulesService } from "../commands/update-broadcast-rules/update-broadcast-rules.service";
import { DeleteBroadcastRulesService } from "../commands/delete-broadcast-rules/delete-broadcast-rules.service";
import { CreateBroadcastRulesService } from "../commands/create-broadcast-rules/create-broadcast-rules.service";
import {
  BroadcastRulesPaginatedResponseDto,
  BroadcastRulesResponseDto,
  CreateBroadcastRulesRequestDto,
  UpdateBroadcastRulesRequestDto,
} from "@epc-services/interface-adapters";

@Controller("finances/broadcast-tool/broadcast-rules")
export class BroadcastRulesMessageController {
  constructor(
    private readonly getPaginatedBroadcastRulesQueryService: GetPaginatedBroadcastRulesQueryService,
    private readonly getBroadcastRulesByIdService: GetBroadcastRulesByIdQueryService,
    private readonly updateBroadcastRulesService: UpdateBroadcastRulesService,
    private readonly deleteBroadcastRulesService: DeleteBroadcastRulesService,
    private readonly createBroadcastRulesService: CreateBroadcastRulesService
  ) {}

  @Get("paginated")
  public async getPaginatedBroadcastRules(): Promise<BroadcastRulesPaginatedResponseDto> {
    const found = await this.getPaginatedBroadcastRulesQueryService.execute();
    return { items: found };
  }

  @Get(":id")
  public async getBroadcastRulesById(
    @Param("id") id: string
  ): Promise<BroadcastRulesResponseDto> {
    const result = await this.getBroadcastRulesByIdService.execute({
      broadcastRulesId: id,
    });
    return result;
  }

  @Put("update")
  public async updateBroadcastRules(
    @Body() body: UpdateBroadcastRulesRequestDto
  ): Promise<BroadcastRulesResponseDto> {
    const entity = await this.updateBroadcastRulesService.execute(body);
    return entity;
  }

  @Delete(":id")
  public async deleteBroadcastRules(@Param("id") id: string): Promise<void> {
    await this.deleteBroadcastRulesService.execute({
      id,
    });
  }

  @Post("create")
  public async createBroadcastRules(
    @Body() body: CreateBroadcastRulesRequestDto
  ): Promise<BroadcastRulesResponseDto> {
    const result = await this.createBroadcastRulesService.execute(body);
    return result;
  }
}
