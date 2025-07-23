import { IsNumber, IsString } from "class-validator";

export class PartnerSendingLimitPerDayRequestDto {
  @IsString()
  public partnerName: string;

  @IsNumber()
  public limit: number;
}
