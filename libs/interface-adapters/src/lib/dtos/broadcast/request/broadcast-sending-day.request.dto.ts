import { IsArray, IsBoolean, IsString } from "class-validator";
import { BroadcastCopyRequestDto } from "./copy.request.dto";

export class BroadcastSendingDayRequestDto {
  @IsString()
  date: string;

  @IsBoolean()
  isModdified: boolean;

  @IsArray()
  copies: BroadcastCopyRequestDto[];

  @IsArray()
  possibleReplacementCopies: BroadcastCopyRequestDto[];
}
