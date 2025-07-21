import { IsArray, IsString } from "class-validator";
import { BroadcastSendingDayRequestDto } from "./broadcast-sending-day.request.dto";

export class BroadcastDomainRequestDto {
  @IsString()
  domain: string;

  @IsString()
  esp: string;

  @IsArray()
  broadcastCopies: BroadcastSendingDayRequestDto[];
}
