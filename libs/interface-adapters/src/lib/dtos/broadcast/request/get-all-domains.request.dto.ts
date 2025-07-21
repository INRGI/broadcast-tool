import { IsString } from "class-validator";

export class GetAllDomainsRequestDto {
  @IsString()
  broadcastId: string;
}
