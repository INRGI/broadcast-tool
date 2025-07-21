import { IsArray } from "class-validator";
import { DomainSendingRequestDto } from "./domain-sending.request.dto";

export class DomainRulesRequestDto {
  @IsArray()
  public allowedMondayStatuses: string[];

  @IsArray()
  public domainSending: DomainSendingRequestDto[];
}
