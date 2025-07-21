import { IsNumber, IsString } from "class-validator";

export class CopySendsCountResponseDto {
  @IsString()
  public copy: string;

  @IsNumber()
  public sends: number;
}
