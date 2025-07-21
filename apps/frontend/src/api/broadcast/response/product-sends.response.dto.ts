import { CopySendsCountResponseDto } from "./copy-sends-count.response.dto";

export interface ProductSendsResponseDto {
  product: string;
  sends: number;
  copies: CopySendsCountResponseDto[];
}
