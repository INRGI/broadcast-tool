import { IsArray, IsString } from "class-validator";
import { DomainStatusResponseDto } from "./domain-status.response.dto";

export class BroadcastDomainsSheetResponseDto {
  @IsString()
  public sheetName: string;

  @IsArray()
  public domains: DomainStatusResponseDto[];
}
