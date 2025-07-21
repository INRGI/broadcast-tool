import { IsArray, IsNumber } from "class-validator";
import { PartnerAllowedSendingDaysRequestDto } from "./partner-allowed-sending-days.request.dto";

export class PartnerRulesRequestDto {
  @IsArray()
  public blacklistedPartners: string[];

  @IsNumber()
  public similarPartnerDomainLimit: number;

  @IsArray()
  partnerAllowedSendingDays: PartnerAllowedSendingDaysRequestDto[];
}
