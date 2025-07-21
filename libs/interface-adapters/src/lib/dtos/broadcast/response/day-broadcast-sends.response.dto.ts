import { IsArray, IsString } from "class-validator";
import { PartnerSendsResponseDto } from "./partner-sends.response.dto";

export class DayBroadcastSendsResponseDto {
  @IsString()
  public date: string;
  
  @IsArray()
  public partners: PartnerSendsResponseDto[];
}
