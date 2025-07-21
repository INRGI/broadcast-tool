import { BroadcastDomain } from '@epc-services/interface-adapters';

export interface CheckCopyLastSendPayload {
  copyName: string;
  broadcastDomain: BroadcastDomain;
  possibleSendingDate: string;
  copyMinDelayPerDays: number;
}
