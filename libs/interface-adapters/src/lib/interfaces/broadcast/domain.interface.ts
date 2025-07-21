import { BroadcastSendingDay } from './broadcast-sending-day.interface';

export interface BroadcastDomain {
  domain: string;
  esp: string;
  broadcastCopies: BroadcastSendingDay[];
}
