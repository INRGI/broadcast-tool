import { IsString } from "class-validator";

export class GetBroadcastsSendsRequestDto {
  @IsString()
  fromDate: string;

  @IsString()
  toDate: string;
}
