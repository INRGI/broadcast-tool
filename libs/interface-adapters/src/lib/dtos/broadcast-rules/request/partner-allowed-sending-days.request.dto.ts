import { IsString } from "class-validator";
import { AllowedSendingDaysRequestDto } from "./allowed-sending-days.request.dto";

export class PartnerAllowedSendingDaysRequestDto {
  @IsString()
  public partner: string;

  public allowedSendingDays: AllowedSendingDaysRequestDto;
}
