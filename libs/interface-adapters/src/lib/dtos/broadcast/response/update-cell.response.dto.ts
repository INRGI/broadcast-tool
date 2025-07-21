import { IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateCellResponseDto {
  @IsBoolean()
  public isUpdated: boolean;

  @IsString()
  public domain: string;

  @IsString()
  public date: string;

  @IsString()
  public value: string;

  @IsNumber()
  public row: number;

  @IsNumber()
  public column: number;
}
