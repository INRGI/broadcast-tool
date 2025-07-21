import { IsNumber, IsString } from "class-validator";

export class CopyMinLimitPerDayRequestDto {
  @IsString()
  public copyName: string;

  @IsNumber()
  public limit: number;
}
