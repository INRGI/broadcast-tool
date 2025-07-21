import { IsArray } from "class-validator";

export class GetDomainStatusesResponseDto {
  @IsArray()
  public uniqueDomainStatuses: string[];

  @IsArray()
  public uniqueParentCompanies: string[];

  @IsArray()
  public uniqueEsps: string[];
}
