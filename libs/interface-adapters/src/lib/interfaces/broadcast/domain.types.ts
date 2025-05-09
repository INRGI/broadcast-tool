export interface BroadcastDomain {
  domain: string;
  esp: string;
  broadcastCopies: { date: string; copies: string[] }[];
}
