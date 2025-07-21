import { IsArray } from "class-validator";

export class GetProductStatusesResponseDto {
  @IsArray()
  public productStatuses: string[];

  @IsArray()
  public domainSendings: string[];

  @IsArray()
  public partners: string[];

  @IsArray()
  public sectors: string[];
}
