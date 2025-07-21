import { IsArray } from "class-validator";
import { ApproveBroadcastSheetResponseDto } from "./approve-broadcast-sheet.response.dto";

export class ApproveBroadcastResponseDto {
  @IsArray()
  broadcast: ApproveBroadcastSheetResponseDto[];
}
