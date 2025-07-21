import { IsArray, IsNumber, IsString } from "class-validator";
import { CopySendsCountResponseDto } from "./copy-sends-count.response.dto";

export class ProductSendsResponseDto {
  @IsString()
  public product: string;

  @IsNumber()
  public sends: number;

  @IsArray()
  public copies: CopySendsCountResponseDto[];
}
