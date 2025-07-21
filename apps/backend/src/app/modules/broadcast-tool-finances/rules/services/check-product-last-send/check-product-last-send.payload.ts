import { BroadcastDomain } from '@epc-services/interface-adapters';

export interface CheckProductLastSendPayload {
  copyName: string;
  broadcastDomain: BroadcastDomain;
  possibleSendingDate: string;
  productMinDelayPerDays: number;
}
