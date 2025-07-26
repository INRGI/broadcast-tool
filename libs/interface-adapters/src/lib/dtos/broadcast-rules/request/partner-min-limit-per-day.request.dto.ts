import { IsNumber, IsString } from "class-validator";

export class PartnerMinLimitPerDayRequestDto {
  @IsString()
  public partnerName: string;

  @IsNumber()
  public limit: number;
}
