import { IsArray, IsString } from "class-validator";

export class BroadcastDomainsSheetResponseDto {
  @IsString()
  public sheetName: string;

  @IsArray()
  public domains: string[];
}
