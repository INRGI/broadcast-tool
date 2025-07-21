import { PartnerSends } from "./partner-sends.interface";

export interface DayBroadcastSends {
  date: string;
  partners: PartnerSends[];
}
