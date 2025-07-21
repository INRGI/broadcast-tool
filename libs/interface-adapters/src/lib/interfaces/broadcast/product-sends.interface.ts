import { CopySendsCount } from "./copy-sends-count.interface";

export interface ProductSends {
  product: string;
  sends: number;
  copies: CopySendsCount[];
}
