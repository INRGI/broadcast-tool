import { UnsubHtmlBlock } from "./unsub-html-block.types";

export interface UnsubLinkUrl {
  linkStart: string;
  unsubType: string;
  sheetName: string;
  linkEnd: string;
  unsubHtmlBlock?: UnsubHtmlBlock;
}
