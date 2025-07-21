import { IsArray, IsNumber, IsString } from "class-validator";
import { ProductSendsResponseDto } from "./product-sends.response.dto";

export class PartnerSendsResponseDto {
  @IsString()
  public partner: string;

  @IsNumber()
  public sends: number;

  @IsArray()
  public products: ProductSendsResponseDto[];
}
