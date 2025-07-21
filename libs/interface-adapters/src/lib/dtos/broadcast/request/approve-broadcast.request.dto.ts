import { ApproveBroadcastSheetRequestDto } from "./approve-broadcast-sheet.request.dto";
import { IsArray } from "class-validator";

export class ApproveBroadcastRequestDto {
  @IsArray()
  broadcast: ApproveBroadcastSheetRequestDto[];
}
