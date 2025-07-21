import { PartnerSendsResponseDto } from "./partner-sends.response.dto";

export interface DayBroadcastSendsResponseDto {
  date: string;
  partners: PartnerSendsResponseDto[];
}
