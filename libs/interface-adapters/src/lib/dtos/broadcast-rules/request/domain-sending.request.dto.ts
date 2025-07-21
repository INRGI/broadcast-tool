import { IsArray, IsString } from "class-validator";

export class DomainSendingRequestDto {
  @IsString()
  public parentCompany: string;

  @IsArray()
  public allowedMondayStatuses: string[];
}
