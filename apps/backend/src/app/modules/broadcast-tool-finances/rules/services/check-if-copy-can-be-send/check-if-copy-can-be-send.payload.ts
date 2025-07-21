import {
  GetAllDomainsResponseDto,
  ProductRules,
  UsageRules,
} from '@epc-services/interface-adapters';

export interface CheckIfCopyCanBeSendPayload {
  domain: string;
  copyName: string;
  sheetName: string;
  broadcast: GetAllDomainsResponseDto;
  sendingDate: string;
  usageRules: UsageRules;
  productRules: ProductRules;
}
