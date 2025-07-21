import { IsUUID } from "class-validator";

export class GetBroadcastRulesByIdRequestDto {
  @IsUUID()
  public broadcastRulesId: string;
}
