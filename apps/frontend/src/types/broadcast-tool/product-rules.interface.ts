import { CopyMinLimitPerDay } from './copy-min-limit-per-day.interface';
import { CopySendingLimitPerDay } from './copy-sending-limit-per-day.interface';
import { PartnerSendingLimitPerDay } from './partner-sending-limit-per-day.interface';
import { ProductAllowedSendingDays } from './product-allowed-sending-days.interface';
import { ProductMinLimitPerDay } from './product-min-limit-per-day.interface';
import { ProductSendingLimitPerDay } from './product-sending-limit-per-day.interface';

export interface ProductRules {
  allowedMondayStatuses: string[];
  blacklistedCopies: string[];
  productAllowedSendingDays: ProductAllowedSendingDays[];
  productsSendingLimitPerDay: ProductSendingLimitPerDay[];
  partnersSendingLimitPerDay: PartnerSendingLimitPerDay[];
  copySendingLimitPerDay: CopySendingLimitPerDay[];
  copyMinLimitPerDay: CopyMinLimitPerDay[];
  productMinLimitPerDay: ProductMinLimitPerDay[];
  blacklistedSectors: string[];
  similarSectorDomainLimit: number;
}
