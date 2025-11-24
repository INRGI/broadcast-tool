import { IsNumber, IsString } from "class-validator";

export class PartnerTabLimitRequestDto {
  @IsString()
  sheetName: string;

  @IsNumber()
  limit: number;

  @IsString()
  partnerName: string;
}
