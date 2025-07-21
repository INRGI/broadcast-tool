import { IsNumber, IsString } from "class-validator";

export class CopySendingLimitPerDayRequestDto {
  @IsString()
  public copyName: string;

  @IsNumber()
  public limit: number;
}
