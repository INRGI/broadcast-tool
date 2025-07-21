import {IsOptional, IsString } from 'class-validator';

export class HealthGetDomainBroadcastWithDateRequestDto {
  @IsString()
  domain: string;
  fromDate: Date;

  @IsOptional()
  toDate?: Date;
}
