import { IsArray, IsString } from "class-validator";
import { BroadcastDomainRequestDto } from "./domain.request.dto";

export class ApproveBroadcastSheetRequestDto {
  @IsString()
  spreadsheetId: string;

  @IsString()
  sheetName: string;

  @IsArray()
  broadcast: BroadcastDomainRequestDto[];
}
