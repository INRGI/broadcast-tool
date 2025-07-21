import { IsNumber, IsString } from "class-validator";

export class CopyTabLimitRequestDto {
  @IsString()
  sheetName: string;

  @IsNumber()
  limit: number;
}
