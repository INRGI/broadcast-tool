import { IsString } from "class-validator";
import { AllowedSendingDaysRequestDto } from "./allowed-sending-days.request.dto";

export class ProductAllowedSendingDaysRequestDto {
  @IsString()
  public product: string;

  public allowedSendingDays: AllowedSendingDaysRequestDto;
}
