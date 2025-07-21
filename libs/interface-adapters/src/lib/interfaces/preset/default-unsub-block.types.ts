import { Padding } from "./padding.types";

export interface DefaultUnsubBlock {
  fontSize: string;
  textColor: string;
  linkColor: string;
  fontFamily: string;
  padding: Padding;
  fontWeight?: string;
  textAlign?: 'center' | 'left' | 'right';
}
