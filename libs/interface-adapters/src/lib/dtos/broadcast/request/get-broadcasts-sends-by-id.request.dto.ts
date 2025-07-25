import { IsString } from "class-validator";

export class GetBroadcastsSendsByIdRequestDto {
  @IsString()
  broadcastRuleId: string;

  @IsString()
  fromDate: string;

  @IsString()
  toDate: string;
}
