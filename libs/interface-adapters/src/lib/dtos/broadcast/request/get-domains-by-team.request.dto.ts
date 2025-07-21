import { IsString } from "class-validator";

export class GetDomainsByTeamRequestDto {
  @IsString()
  team: string;
}
