import { IsArray, IsNumber } from "class-validator";
import { ProductAllowedSendingDaysRequestDto } from "./product-allowed-sending-days.request.dto";
import { ProductSendingLimitPerDayRequestDto } from "./product-sending-limit-per-day.request.dto";
import { CopySendingLimitPerDayRequestDto } from "./copy-sending-limit-per-day.request.dto";
import { CopyMinLimitPerDayRequestDto } from "./copy-min-limit-per-day.request.dto";

export class ProductRulesRequestDto {
  @IsArray()
  public allowedMondayStatuses: string[];

  @IsArray()
  public blacklistedCopies: string[];

  @IsArray()
  public productAllowedSendingDays: ProductAllowedSendingDaysRequestDto[];

  @IsArray()
  public productsSendingLimitPerDay: ProductSendingLimitPerDayRequestDto[];

  @IsArray()
  public copySendingLimitPerDay: CopySendingLimitPerDayRequestDto[];

  @IsArray()
  public copyMinLimitPerDay: CopyMinLimitPerDayRequestDto[];

  @IsArray()
  public blacklistedSectors: string[];

  @IsNumber()
  public similarSectorDomainLimit: number;
}
