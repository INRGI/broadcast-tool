import { CopyMinLimitPerDay } from './copy-min-limit-per-day.interface';
import { CopySendingLimitPerDay } from './copy-sending-limit-per-day.interface';
import { ProductAllowedSendingDays } from './product-allowed-sending-days.interface';
import { ProductSendingLimitPerDay } from './product-sending-limit-per-day.interface';

export interface ProductRules {
  allowedMondayStatuses: string[];
  blacklistedCopies: string[];
  productAllowedSendingDays: ProductAllowedSendingDays[];
  productsSendingLimitPerDay: ProductSendingLimitPerDay[];
  copySendingLimitPerDay: CopySendingLimitPerDay[];
  copyMinLimitPerDay: CopyMinLimitPerDay[];
  blacklistedSectors: string[];
  similarSectorDomainLimit: number;
}
