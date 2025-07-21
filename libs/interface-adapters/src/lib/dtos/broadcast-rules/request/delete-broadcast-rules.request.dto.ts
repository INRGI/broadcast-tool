import { IsUUID } from "class-validator";

export class DeleteBroadcastRulesRequestDto {
  @IsUUID()
  public id: string;
}
