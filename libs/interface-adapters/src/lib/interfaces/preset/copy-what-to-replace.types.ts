import { IsPadding } from './is-padding.types';

export interface CopyWhatToReplace {
  isFontSize: boolean;
  isFontFamily: boolean;
  isLinkColor: boolean;
  isMaxWidth: boolean;
  isLineHeight: boolean;
  isPadding: IsPadding;
  isBgColor: boolean;
  isLinkUrl: boolean;
  isUnsubLink: boolean;
  isAntiSpam: 'None' | 'Full Anti Spam' | 'Spam Words Only';
  isBotTrap: boolean;
}
