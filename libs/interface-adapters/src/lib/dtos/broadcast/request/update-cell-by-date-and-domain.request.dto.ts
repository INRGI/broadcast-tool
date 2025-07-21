import { IsString } from "class-validator";

export class UpdateCellByDateAndDomainRequestDto {
  @IsString()
  spreadsheetId: string;

  @IsString()
  sheetName: string;

  @IsString()
  date: string;

  @IsString()
  domain: string;

  @IsString()
  newValue: string;
}
