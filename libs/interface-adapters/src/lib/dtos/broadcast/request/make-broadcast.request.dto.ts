import { IsString } from "class-validator";

export class MakeBroadcastRequestDto {
  @IsString()
  broadcastRuleId: string;

  @IsString()
  fromDate: string;

  @IsString()
  toDate: string;
}
