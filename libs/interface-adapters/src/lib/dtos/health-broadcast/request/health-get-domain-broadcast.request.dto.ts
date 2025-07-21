import { IsString } from 'class-validator';

export class HealthGetDomainBroadcastRequestDto {
  @IsString()
  domain: string;
}
