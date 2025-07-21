import { ProductSendsResponseDto } from "./product-sends.response.dto";

export interface PartnerSendsResponseDto {
  partner: string;
  sends: number;
  products: ProductSendsResponseDto[];
}
