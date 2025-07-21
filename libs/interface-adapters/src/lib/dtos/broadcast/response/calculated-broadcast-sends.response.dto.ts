import { IsArray, IsString } from "class-validator";
import { DayBroadcastSendsResponseDto } from "./day-broadcast-sends.response.dto";

export class CalculatedBroadcastSendsResponseDto {
  @IsArray()
  public result: DayBroadcastSendsResponseDto[];

  @IsString()
  public name: string;
}
