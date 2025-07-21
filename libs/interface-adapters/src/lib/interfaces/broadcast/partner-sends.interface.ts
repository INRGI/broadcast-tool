import { ProductSends } from "./product-sends.interface";

export interface PartnerSends {
  partner: string;
  sends: number;
  products: ProductSends[];
}
