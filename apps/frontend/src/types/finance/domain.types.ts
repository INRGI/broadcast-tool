import { BroadcastCopy } from "./copy.types";

export interface BroadcastDomain {
  domain: string;
  esp: string;
  broadcastCopies: { date: string; copies: BroadcastCopy[]; isModdified: boolean }[];
}
