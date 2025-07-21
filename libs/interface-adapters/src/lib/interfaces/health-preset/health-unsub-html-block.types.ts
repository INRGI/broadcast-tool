import { HealthCustomUnsubBlock } from './health-custom-unsub-block.types';
import { HealthDefaultUnsubBlock } from './health-default-unsub-block.types';

export interface HealthUnsubHtmlBlock {
  isUnsubHtmlBlock: boolean;
  htmlType: 'default' | 'custom';
  customHtmlBlock?: HealthCustomUnsubBlock;
  defaultHtmlBlock?: HealthDefaultUnsubBlock;
}
