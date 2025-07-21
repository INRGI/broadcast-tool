import { IsString } from 'class-validator';

export class GetDomainBroadcastRequestDto {
  @IsString()
  team: string;

  @IsString()
  domain: string;
}
