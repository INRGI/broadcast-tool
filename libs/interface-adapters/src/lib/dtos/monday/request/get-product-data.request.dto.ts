import { IsString } from "class-validator";

export class GetProductDataRequestDto {
  @IsString()
  product: string;
}
