import { HealthPadding } from "./health-padding.types";

export interface HealthDefaultUnsubBlock {
  fontSize: string;
  textColor: string;
  linkColor: string;
  fontFamily: string;
  padding: HealthPadding;
  fontWeight?: string;
  textAlign?: 'center' | 'left' | 'right';
}
