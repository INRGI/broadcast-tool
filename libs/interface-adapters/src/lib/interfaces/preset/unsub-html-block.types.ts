import { CustomUnsubBlock } from './custom-unsub-block.types';
import { DefaultUnsubBlock } from './default-unsub-block.types';

export interface UnsubHtmlBlock {
  isUnsubHtmlBlock: boolean;
  htmlType: 'default' | 'custom';
  customHtmlBlock?: CustomUnsubBlock;
  defaultHtmlBlock?: DefaultUnsubBlock;
}
