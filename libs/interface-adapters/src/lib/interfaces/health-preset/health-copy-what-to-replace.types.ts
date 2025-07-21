import { HealthIsPadding } from './health-is-padding.types';

export interface HealthCopyWhatToReplace {
  isFontSize: boolean;
  isFontFamily: boolean;
  isLinkColor: boolean;
  isMaxWidth: boolean;
  isLineHeight: boolean;
  isPadding: HealthIsPadding;
  isBgColor: boolean;
  isLinkUrl: boolean;
  isUnsubLink: boolean;
  isAntiSpam: 'None' | 'Full Anti Spam' | 'Spam Words Only';
  isBotTrap: boolean;
}
