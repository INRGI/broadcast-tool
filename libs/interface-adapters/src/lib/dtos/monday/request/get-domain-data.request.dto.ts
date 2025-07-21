import { IsString } from "class-validator";

export class GetDomainDataRequestDto {
  @IsString()
  domain: string;
}
