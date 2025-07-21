export interface LinkUrl {
  linkStart: string;
  trackingType: string;
  linkEnd: string;
  productCode: 'PRODUCT#IMAGE' | 'IMG0000_#IMAGE' | '0000_#IMAGE' | '000_#IMAGE' | 'TRACKINGID_#IMAGE';
}
/**
|--------------------------------------------------
| product=BTUA1OS1 | PRODUCT#IMAGE
| product=IMG0422_1OS1 | IMG0000_#IMAGE
| product=0422_1OS1 | 0000_#IMAGE
  product=422_1OS1 ?????? | 000_#IMAGE
|--------------------------------------------------
*/