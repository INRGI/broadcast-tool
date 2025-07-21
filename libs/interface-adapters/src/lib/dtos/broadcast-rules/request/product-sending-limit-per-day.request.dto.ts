import { IsNumber, IsString } from "class-validator";

export class ProductSendingLimitPerDayRequestDto {
  @IsString()
  public productName: string;

  @IsNumber()
  public limit: number;
}
