import { IsString } from "class-validator";

export class DomainStatusResponseDto {
  @IsString()
  public domainName: string;

  @IsString()
  public status: string;
}
