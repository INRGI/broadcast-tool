import { IsString } from "class-validator";

export class GetBroadcastDomainsListRequestDto {
  @IsString()
  broadcastId: string;
}
