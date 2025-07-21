export interface BigQueryRow {
  Date: string;
  Domain: string;
  Type: string;
  Copy: string;
  Offer: string;
  Month: string;
  ISP: string;
  UC: number;
  TC: number;
  Conversion: number;
  Sends?: number;
}
