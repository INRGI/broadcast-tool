import { IsNumber, IsString } from "class-validator";

export class ProductMinLimitPerDayRequestDto {
  @IsString()
  public productName: string;

  @IsNumber()
  public limit: number;
}
