import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetDomainBroadcastWithDateRequestDto {
  @IsString()
  team: string;

  @IsString()
  domain: string;
  fromDate: Date;

  @IsOptional()
  toDate?: Date;
}
