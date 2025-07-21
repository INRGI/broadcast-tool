import { IsArray, IsString } from "class-validator";
import { BroadcastDomainRequestDto } from "../request/domain.request.dto";

export class BroadcastSheetResponseDto {
  @IsString()
  public sheetName: string;

  @IsArray()
  public domains: BroadcastDomainRequestDto[];
}
