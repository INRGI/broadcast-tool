import { BroadcastCopy } from "./copy.interface";

export interface BroadcastSendingDay {
  date: string;
  copies: BroadcastCopy[];
  isModdified: boolean;
  possibleReplacementCopies: BroadcastCopy[];
}
